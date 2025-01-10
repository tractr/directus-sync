import { Container } from 'typedi';
import { LOGGER } from '../../constants';
import pino from 'pino';
import { getChildLogger } from '../../helpers';
import { SeedMeta, SeedData } from './interfaces';
import { SeedDataMapper } from './data-mapper';
import { SeedIdMapperClient } from './id-mapper-client';
import { SeedDataClient } from './data-client';
import { unwrapDirectusRequestError } from '../collections/base/helpers';
import { SnapshotClient } from '../snapshot';
import { Cacheable } from 'typescript-cacheable';
import {
  DirectusId,
  DirectusUnknownType,
} from '../collections/base/interfaces';

export class SeedCollection {
  /**
   * Enable/disable operations based on meta configuration
   */
  protected readonly enableCreate: boolean;
  protected readonly enableUpdate: boolean;
  protected readonly enableDelete: boolean;
  protected readonly preserveIds: boolean;

  protected readonly snapshotClient: SnapshotClient;
  protected readonly dataMapper: SeedDataMapper;
  protected readonly idMapper: SeedIdMapperClient;
  protected readonly dataClient: SeedDataClient;
  protected readonly logger: pino.Logger;

  constructor(
    protected readonly collection: string,
    protected readonly meta: SeedMeta,
  ) {
    // Get base logger
    const baseLogger = Container.get<pino.Logger>(LOGGER);
    this.logger = getChildLogger(baseLogger, `Collection:${collection}`);

    // Get snapshot client
    this.snapshotClient = Container.get(SnapshotClient);

    // Create data mapper
    this.dataMapper = new SeedDataMapper(collection, meta);

    // Create id mapper client
    this.idMapper = SeedIdMapperClient.forCollection(collection);

    // Create data client
    this.dataClient = new SeedDataClient(collection);

    // Configure operations based on meta
    this.enableCreate = meta.create;
    this.enableUpdate = meta.update;
    this.enableDelete = meta.delete;
    this.preserveIds = meta.preserve_ids;
  }

  /**
   * Push the seed data to the collection
   */
  async push(data: SeedData): Promise<boolean> {
    // Initialize data mapper
    await this.dataMapper.initialize();

    // Store data in data mapper for mapping
    const itemsWithoutIds = data.map(({ _sync_id, ...rest }) => ({
      ...rest,
      _syncId: _sync_id,
    }));

    let shouldRetryCreate = false;
    let shouldRetryUpdate = false;

    // Get existing items with the same sync ids
    const existingItems = await this.getExistingItems(data);

    // Separate items to create and update
    const toCreate = itemsWithoutIds.filter(
      (_, index) => !existingItems[index],
    );
    const toUpdate = itemsWithoutIds
      .map((item, index) => ({
        targetItem: existingItems[index],
        diffItem: item,
      }))
      .filter(({ targetItem }) => targetItem !== null);

    // Process items
    if (this.enableCreate) {
      shouldRetryCreate = await this.createItems(toCreate);
    }

    if (this.enableUpdate) {
      shouldRetryUpdate = await this.updateItems(toUpdate);
    }

    if (this.enableDelete) {
      await this.deleteItems(data.map((item) => item._sync_id));
    }

    return shouldRetryCreate || shouldRetryUpdate;
  }

  /**
   * Get existing items with the same sync ids
   */
  protected async getExistingItems(
    data: SeedData,
  ): Promise<DirectusUnknownType[]> {
    const existingItems: DirectusUnknownType[] = [];

    for (const item of data) {
      const idMap = await this.idMapper.getBySyncId(item._sync_id);
      if (!idMap) {
        continue;
      }

      const [existingItem] = await this.dataClient.queryByPrimaryField(
        idMap.local_id,
      );

      if (!existingItem) {
        this.logger.warn(
          { item, _syncId: item._sync_id },
          `Item ${item._sync_id} already exists but id map was missing. Will recreate id map.`,
        );
        continue;
      }

      existingItems.push({
        ...existingItem,
        id: idMap.local_id,
        _syncId: item._sync_id,
      });
    }

    return existingItems;
  }

  /**
   * Create new items in the collection
   */
  protected async createItems(
    items: Array<DirectusUnknownType & { _syncId: string }>,
  ): Promise<boolean> {
    let shouldRetry = false;

    for (const item of items) {
      try {
        const mappedItem = await this.dataMapper.mapSyncIdToLocalId(item);
        if (!mappedItem) {
          shouldRetry = true;
          continue;
        }

        const { _syncId, ...createPayload } = mappedItem;
        if (this.preserveIds) {
          createPayload.id = _syncId;
        }

        const newItem = await this.dataClient.create(createPayload);
        await this.idMapper.create(await this.getPrimaryKey(newItem), _syncId);
      } catch (error) {
        await this.handleCreationError(error, item);
      }
    }

    return shouldRetry;
  }

  /**
   * Handle errors that occur during item creation
   * If the error is due to a missing id map for an existing item,
   * recreate the id map. Otherwise, throw the error.
   */
  protected async handleCreationError(
    error: unknown,
    item: DirectusUnknownType & { _syncId: string },
  ): Promise<void> {
    const flattenError = unwrapDirectusRequestError(error);

    // Check if error is due to unique constraint violation
    if (this.preserveIds && flattenError.code === 'RECORD_NOT_UNIQUE') {
      // Item exists but id map is missing, recreate id map
      const [existingItem] = await this.dataClient.queryByPrimaryField(
        item._syncId,
      );

      if (existingItem) {
        this.logger.warn(
          { item, _syncId: item._syncId },
          `Item ${item._syncId} already exists but id map was missing. Will recreate id map.`,
        );
        await this.idMapper.create(
          await this.getPrimaryKey(existingItem),
          item._syncId,
        );
        return;
      }

      throw new Error(
        `Cannot find item that should already exist. Previous error: ${flattenError.message}`,
      );
    }

    // If error is not handled, rethrow it
    throw error;
  }

  /**
   * Update existing items in the collection
   */
  protected async updateItems(
    items: Array<{
      targetItem: DirectusUnknownType & { id: string };
      diffItem: DirectusUnknownType & { _syncId: string };
    }>,
  ): Promise<boolean> {
    let shouldRetry = false;

    for (const { targetItem, diffItem } of items) {
      const mappedItem = await this.dataMapper.mapSyncIdToLocalId(diffItem);
      if (!mappedItem) {
        shouldRetry = true;
        continue;
      }

      const { _syncId, ...updatePayload } = mappedItem;
      await this.dataClient.update(targetItem.id, updatePayload);
    }

    return shouldRetry;
  }

  /**
   * Delete items that are not in the seed data
   */
  protected async deleteItems(seedSyncIds: string[]): Promise<void> {
    const allIdMaps = await this.idMapper.getAll();
    const syncIdsSet = new Set(seedSyncIds);
    const toDelete = allIdMaps.filter(
      (idMap) => !syncIdsSet.has(idMap.sync_id),
    );

    for (const idMap of toDelete) {
      await this.dataClient.delete(idMap.local_id);
      await this.idMapper.removeBySyncId(idMap.sync_id);
    }
  }

  /**
   * Get the primary field of the collection
   */
  @Cacheable()
  protected async getPrimaryFieldName(): Promise<string> {
    return (await this.snapshotClient.getPrimaryField(this.collection)).name;
  }

  /**
   * Get the primary key from an item
   */
  protected async getPrimaryKey(
    item: DirectusUnknownType,
  ): Promise<DirectusId> {
    const primaryFieldName = await this.getPrimaryFieldName();
    return item[primaryFieldName] as DirectusId;
  }

  /**
   * Returns a filter for the primary key
   */
  protected async getPrimaryKeyFilter(primaryKey: DirectusId) {
    const primaryFieldName = await this.getPrimaryFieldName();
    return { [primaryFieldName]: { _eq: primaryKey } };
  }
}
