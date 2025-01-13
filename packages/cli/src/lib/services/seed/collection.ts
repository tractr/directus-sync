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
import {
  DirectusId,
  DirectusUnknownType,
  WithSyncId,
} from '../collections/base/interfaces';
import { SeedDataDiffer } from './data-differ';

export class SeedCollection {
  protected readonly logger: pino.Logger;
  protected readonly snapshotClient: SnapshotClient;
  protected readonly dataMapper: SeedDataMapper;
  protected readonly idMapper: SeedIdMapperClient;
  protected readonly dataClient: SeedDataClient;
  protected readonly dataDiffer: SeedDataDiffer;

  constructor(
    protected readonly collection: string,
    protected readonly meta: SeedMeta,
  ) {
    // Initialize services
    const baseLogger = Container.get<pino.Logger>(LOGGER);
    this.logger = getChildLogger(baseLogger, `Collection:${collection}`);
    this.snapshotClient = Container.get(SnapshotClient);
    this.dataMapper = new SeedDataMapper(collection, meta);
    this.idMapper = SeedIdMapperClient.forCollection(collection);
    this.dataClient = new SeedDataClient(collection);
    this.dataDiffer = new SeedDataDiffer(
      collection,
      this.dataClient,
      this.dataMapper,
      this.idMapper,
      meta,
    );
  }

  /**
   * Push the seed data to the collection
   */
  async push(data: SeedData): Promise<boolean> {
    // Initialize data mapper and differ
    await this.dataMapper.initialize();
    await this.dataDiffer.initialize();

    // Convert data to the expected format
    const sourceData = data.map(({ _sync_id, ...rest }) => ({
      ...rest,
      _syncId: _sync_id,
    }));

    // Get the diff between source and target data
    const { toCreate, toUpdate, toDelete, unchanged, dangling } =
      await this.dataDiffer.getDiff(sourceData);

    // Log the diff
    this.logger.info(`Dangling id maps: ${dangling.length} item(s)`);
    this.logger.info(`To create: ${toCreate.length} item(s)`);
    this.logger.info(`To update: ${toUpdate.length} item(s)`);
    this.logger.info(`To delete: ${toDelete.length} item(s)`);
    this.logger.info(`Unchanged: ${unchanged.length} item(s)`);

    let shouldRetryCreate = false;
    let shouldRetryUpdate = false;

    // Process items based on meta configuration
    if (this.meta.create) {
      shouldRetryCreate = await this.create(toCreate);
    }

    if (this.meta.update) {
      shouldRetryUpdate = await this.update(toUpdate);
    }

    if (this.meta.delete) {
      await this.delete(toDelete);
    }

    // Clean up dangling items
    await this.removeDangling(dangling);

    return shouldRetryCreate || shouldRetryUpdate;
  }

  /**
   * Create new items
   */
  protected async create(
    toCreate: WithSyncId<DirectusUnknownType>[],
  ): Promise<boolean> {
    let shouldRetry = false;

    for (const sourceItem of toCreate) {
      try {
        const mappedItem = await this.dataMapper.mapSyncIdToLocalId(sourceItem);
        if (!mappedItem) {
          shouldRetry = true;
          continue;
        }

        const { _syncId, ...createPayload } = mappedItem;
        if (this.meta.preserve_ids) {
          createPayload.id = _syncId as DirectusId;
        }

        const newItem = await this.dataClient.create(createPayload);
        const primaryKey = await this.getPrimaryKey(newItem);
        await this.idMapper.create(primaryKey, _syncId);
        this.logger.debug(sourceItem, 'Created item');
      } catch (error) {
        await this.handleCreationError(error, sourceItem);
      }
    }

    this.logger.info(`Created ${toCreate.length} items`);
    if (shouldRetry) {
      this.logger.warn('Some items could not be created and will be retried');
    }

    return shouldRetry;
  }

  /**
   * Update existing items
   */
  protected async update(
    toUpdate: Array<{
      sourceItem: WithSyncId<DirectusUnknownType>;
      targetItem: WithSyncId<DirectusUnknownType>;
      diffItem: Partial<WithSyncId<DirectusUnknownType>>;
    }>,
  ): Promise<boolean> {
    let shouldRetry = false;

    for (const { targetItem, diffItem } of toUpdate) {
      const mappedItem = await this.dataMapper.mapSyncIdToLocalId(diffItem);
      if (!mappedItem) {
        shouldRetry = true;
        continue;
      }

      const primaryKey = await this.getPrimaryKey(targetItem);
      await this.dataClient.update(primaryKey, mappedItem);
      this.logger.debug(diffItem, `Updated ${primaryKey}`);
    }

    this.logger.info(`Updated ${toUpdate.length} items`);
    if (shouldRetry) {
      this.logger.warn('Some items could not be updated and will be retried');
    }

    return shouldRetry;
  }

  /**
   * Delete items
   */
  protected async delete(
    toDelete: Array<{ local_id: string; sync_id: string }>,
  ) {
    for (const item of toDelete) {
      await this.dataClient.delete(item.local_id);
      await this.idMapper.removeBySyncId(item.sync_id);
      this.logger.debug(item, `Deleted ${item.local_id}`);
    }
    this.logger.info(`Deleted ${toDelete.length} items`);
  }

  /**
   * Remove dangling items
   */
  protected async removeDangling(
    dangling: Array<{ local_id: string; sync_id: string }>,
  ) {
    for (const item of dangling) {
      await this.idMapper.removeBySyncId(item.sync_id);
      this.logger.debug(item, `Removed dangling id map`);
    }
    this.logger.info(`Removed ${dangling.length} dangling items`);
  }

  /**
   * Handle creation errors
   */
  protected async handleCreationError(
    error: unknown,
    item: WithSyncId<DirectusUnknownType>,
  ): Promise<void> {
    const flattenError = unwrapDirectusRequestError(error);

    if (this.meta.preserve_ids && flattenError.code === 'RECORD_NOT_UNIQUE') {
      const [existingItem] = await this.dataClient.queryByPrimaryField(
        item._syncId,
      );

      if (existingItem) {
        this.logger.warn(
          { item },
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

    throw error;
  }

  /**
   * Get the primary key from an item
   */
  protected async getPrimaryKey(item: DirectusUnknownType): Promise<string> {
    const primaryFieldName = await this.getPrimaryFieldName();
    return item[primaryFieldName] as string;
  }

  /**
   * Get the primary field name
   */
  protected async getPrimaryFieldName(): Promise<string> {
    return (await this.snapshotClient.getPrimaryField(this.collection)).name;
  }
}
