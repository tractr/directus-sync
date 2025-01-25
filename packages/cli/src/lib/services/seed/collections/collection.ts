import { Inject, Service } from 'typedi';
import { COLLECTION, LOGGER, META } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { SeedMeta, SeedData } from '../interfaces';
import { SeedDataMapper } from './data-mapper';
import {
  SchemaClient,
  SeedIdMapperClient,
  SeedIdMapperClientFactory,
} from '../global';
import { SeedDataClient } from './data-client';
import {
  DirectusId,
  WithSyncId,
  unwrapDirectusRequestError,
} from '../../collections';
import { SeedDataDiffer } from './data-differ';
import { DirectusUnknownType } from '../../interfaces';

@Service()
export class SeedCollection {
  protected readonly logger: pino.Logger;
  protected readonly idMapper: SeedIdMapperClient;

  constructor(
    @Inject(LOGGER) protected readonly baseLogger: pino.Logger,
    @Inject(COLLECTION) protected readonly collection: string,
    @Inject(META) protected readonly meta: SeedMeta,
    protected readonly dataMapper: SeedDataMapper,
    protected readonly idMapperFactory: SeedIdMapperClientFactory,
    protected readonly dataClient: SeedDataClient,
    protected readonly dataDiffer: SeedDataDiffer,
    protected readonly schemaClient: SchemaClient,
  ) {
    this.logger = getChildLogger(baseLogger, collection);
    this.idMapper = this.idMapperFactory.forCollection(collection);
  }

  /**
   * Push the seed data to the collection
   */
  async push(data: SeedData): Promise<boolean> {
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

    return shouldRetryCreate || shouldRetryUpdate;
  }

  /**
   * Clean up dangling dangling items
   */
  async cleanUp() {
    const dangling = await this.dataDiffer.getDanglingIds();
    await this.removeDangling(dangling);
    this.idMapper.clearCache();
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
    return (await this.schemaClient.getPrimaryField(this.collection)).name;
  }

  /**
   * Display the diff between source and target data
   */
  async diff(data: SeedData) {
    // Convert data to the expected format
    const sourceData = data.map(({ _sync_id, ...rest }) => ({
      ...rest,
      _syncId: _sync_id,
    }));

    // Get the diff between source and target data
    const { toCreate, toUpdate, toDelete, unchanged, dangling } =
      await this.dataDiffer.getDiff(sourceData);

    // Log dangling items
    this.logger.info(`Dangling id maps: ${dangling.length} item(s)`);
    for (const idMap of dangling) {
      this.logger.debug(idMap, `Will remove dangling id map`);
    }

    // Log items to create
    this.logger.info(`To create: ${toCreate.length} item(s)`);
    for (const item of toCreate) {
      this.logger.debug(item, `Will create item`);
    }

    // Log items to update
    this.logger.info(`To update: ${toUpdate.length} item(s)`);
    for (const { targetItem, diffItem } of toUpdate) {
      const primaryKey = await this.getPrimaryKey(targetItem);
      this.logger.debug(
        { diffItem, primaryKey },
        `Will update item (${primaryKey})`,
      );
    }

    // Log items to delete
    this.logger.info(`To delete: ${toDelete.length} item(s)`);
    for (const item of toDelete) {
      this.logger.debug(item, `Will delete item (${item.local_id})`);
    }

    // Log unchanged items
    this.logger.info(`Unchanged: ${unchanged.length} item(s)`);
    for (const item of unchanged) {
      const primaryKey = await this.getPrimaryKey(item);
      this.logger.debug(`Item ${primaryKey} is unchanged`);
    }

    // Return the diff results
    return { toCreate, toUpdate, toDelete, unchanged, dangling };
  }
}
