import { IdMap, IdMapperClient } from './id-mapper-client';
import {
  DirectusBaseType,
  DirectusCollectionExtraConfig,
  DirectusId,
  Query,
  UpdateItem,
  WithoutId,
  WithoutSyncId,
  WithSyncId,
  WithSyncIdAndWithoutId,
} from './interfaces';
import { DataClient } from './data-client';
import { DataLoader } from './data-loader';
import { DataDiffer } from './data-differ';
import pino from 'pino';
import { DataMapper } from './data-mapper';
import { CollectionHooks } from '../../config';
import { MigrationClient } from '../../migration-client';
import { unwrapDirectusRequestError } from './helpers';
import { debugOrInfoLogger } from '../../../helpers';

/**
 * This class is responsible for merging the data from a dump to a target table.
 * It creates new data, updates existing data and deletes data that is not present in the dump.
 */
export abstract class DirectusCollection<
  DirectusType extends DirectusBaseType,
> {
  protected abstract readonly enableCreate: boolean;
  protected abstract readonly enableUpdate: boolean;
  protected abstract readonly enableDelete: boolean;

  protected readonly hooks: CollectionHooks;

  /**
   * If true, the ids of the items will be used as sync ids.
   * This allows to restore the same ids as the original table.
   */
  protected readonly preserveIds: boolean = false;

  /**
   * Used to keep data in memory between the pull and the postProcessPull.
   */
  protected tempData: WithSyncIdAndWithoutId<DirectusType>[] = [];

  /**
   * Log message to debug or info, depending on the debug flag
   */
  protected readonly debugOrInfo: ReturnType<typeof debugOrInfoLogger>;

  constructor(
    protected readonly logger: pino.Logger,
    protected readonly dataDiffer: DataDiffer<DirectusType>,
    protected readonly dataLoader: DataLoader<DirectusType>,
    protected readonly dataClient: DataClient<DirectusType>,
    protected readonly dataMapper: DataMapper<DirectusType>,
    protected readonly idMapper: IdMapperClient,
    protected readonly migrationClient: MigrationClient,
    extraConfig: DirectusCollectionExtraConfig,
  ) {
    this.hooks = extraConfig.hooks;
    // Override preserveIds if it is set to true in the extra config
    this.preserveIds = extraConfig.preserveIds ? true : this.preserveIds;
    this.debugOrInfo = debugOrInfoLogger(this.logger);
  }

  /**
   * Pull data from a table to a JSON file
   */
  async pull() {
    const baseQuery: Query<DirectusType> = { limit: -1 };
    const { onQuery } = this.hooks;
    const transformedQuery = onQuery
      ? await onQuery(baseQuery, await this.migrationClient.get())
      : baseQuery;
    const items = await this.dataClient.query(transformedQuery);
    const mappedItems = await this.mapIdsOfItems(items);
    const itemsWithoutIds = this.removeIdsOfItems(mappedItems);
    await this.setTempData(itemsWithoutIds);
    this.logger.debug(`Pulled ${mappedItems.length} items.`);
  }

  /**
   * This methods will change ids to sync ids and add users placeholders.
   */
  async postProcessPull() {
    const items = this.getTempData();
    const mappedItems =
      await this.dataMapper.mapIdsToSyncIdAndRemoveIgnoredFields(items);
    await this.dataLoader.saveData(mappedItems);
    this.logger.debug(`Post-processed ${mappedItems.length} items.`);
  }

  async diff() {
    // Get the diff between the dump and the target table and log it
    const { toCreate, toUpdate, toDelete, unchanged, dangling } =
      await this.dataDiffer.getDiff();

    this.debugOrInfo(
      dangling.length > 0,
      `Dangling id maps: ${dangling.length} item(s)`,
    );
    for (const idMap of dangling) {
      this.logger.debug(idMap, `Will remove dangling id map`);
    }

    this.debugOrInfo(
      toCreate.length > 0,
      `To create: ${toCreate.length} item(s)`,
    );
    for (const item of toCreate) {
      this.logger.info(item, `Will create item`);
    }

    this.debugOrInfo(
      toUpdate.length > 0,
      `To update: ${toUpdate.length} item(s)`,
    );
    for (const { targetItem, diffItem } of toUpdate) {
      this.logger.info(diffItem, `Will update item (id: ${targetItem.id})`);
    }

    this.debugOrInfo(
      toDelete.length > 0,
      `To delete: ${toDelete.length} item(s)`,
    );
    for (const item of toDelete) {
      this.logger.info(item, `Will delete item (id: ${item.id})`);
    }

    this.logger.debug(`Unchanged: ${unchanged.length} item(s)`);
    for (const item of unchanged) {
      this.logger.debug(`Item ${item.id} is unchanged`);
    }
  }

  /**
   * Merge the data from the dump to the target table
   */
  async push() {
    let shouldRetryCreate = false;
    let shouldRetryUpdate = false;
    const { toCreate, toUpdate, toDelete } = await this.dataDiffer.getDiff();

    if (this.enableCreate) {
      shouldRetryCreate = await this.create(toCreate);
    }
    if (this.enableUpdate) {
      shouldRetryUpdate = await this.update(toUpdate);
    }
    if (this.enableDelete) {
      await this.delete(toDelete);
    }

    // If there are items to retry, run the restore again
    return shouldRetryCreate || shouldRetryUpdate;
  }

  /**
   * Clean collections and orphan sync id
   */
  async cleanUp() {
    const { dangling } = await this.dataDiffer.getDiff();
    // All dangling items should be deleted first
    await this.removeDangling(dangling);
    // Clear the id mapper cache
    this.idMapper.clearCache();
  }

  /**
   * Temporary store the data in memory.
   */
  protected async setTempData(data: WithSyncIdAndWithoutId<DirectusType>[]) {
    const { onDump } = this.hooks;
    this.tempData = onDump
      ? await onDump(data, await this.migrationClient.get())
      : data;
  }

  /**
   * Returns the data stored in memory.
   */
  protected getTempData(): WithSyncIdAndWithoutId<DirectusType>[] {
    return this.tempData;
  }

  /**
   * For each item, try to get the mapped id if exists from the idMapper, or create it if not.
   */
  protected async mapIdsOfItems<T extends DirectusBaseType>(
    items: T[],
  ): Promise<WithSyncId<T>[]> {
    const output: WithSyncId<T>[] = [];
    for (const item of items) {
      const idMap = await this.idMapper.getByLocalId(item.id.toString());
      if (idMap) {
        output.push({ ...item, _syncId: idMap.sync_id });
      } else {
        const newSyncId = await this.idMapper.create(
          item.id,
          this.preserveIds ? item.id.toString() : undefined,
        );
        output.push({ ...item, _syncId: newSyncId });
      }
    }
    return output;
  }

  /**
   * Remove the id of the items
   */
  protected removeIdsOfItems<T extends DirectusBaseType>(
    items: T[],
  ): WithoutId<T>[] {
    return items.map(({ id, ...rest }) => rest as WithoutId<T>);
  }

  /**
   * This method returns true if there are items to retry.
   */
  protected async create(toCreate: WithSyncIdAndWithoutId<DirectusType>[]) {
    const toRetry = [];

    for (const sourceItem of toCreate) {
      // Try to map the sync id to the local id
      const mappedItem = await this.dataMapper.mapSyncIdToLocalId(sourceItem);
      if (!mappedItem) {
        toRetry.push(sourceItem);
        continue;
      }

      // If the id mapping was successful, create the item
      const { _syncId, ...rest } = mappedItem;
      const createPayload = rest as unknown as WithoutSyncId<DirectusType>;
      if (this.preserveIds) {
        createPayload.id = _syncId as DirectusId;
      }
      // In some cases, the sync id map may be missing but the item is already in the target table
      // If the ids are preserved, the creation will fail because the id already exists
      // We have to handle this case and recreate the missing id map
      //https://github.com/tractr/directus-sync/issues/92
      let newItem: DirectusType;
      try {
        newItem = await this.dataClient.create(createPayload);
        this.logger.debug(sourceItem, `Created item`);
      } catch (error) {
        newItem = await this.handleCreationError(
          error as Error,
          createPayload,
          _syncId,
        );
      }

      // Create new entry in the id mapper
      const syncId = await this.idMapper.create(newItem.id, _syncId);
      this.logger.debug({ syncId, localId: newItem.id }, `Created id map`);
    }

    // Log results
    this.debugOrInfo(
      toCreate.length > 0,
      `Created ${toCreate.length} items`,
    );
    if (toRetry.length) {
      this.logger.warn(
        `Could not create ${toRetry.length} items. Must run again.`,
      );
    }
    return toRetry.length > 0;
  }

  /**
   * Handle the error when creating an item.
   * Returns the item if the error can be handled.
   * Re-throws the error otherwise.
   */
  protected async handleCreationError(
    error: Error,
    payload: WithoutSyncId<DirectusType>,
    _syncId: string,
  ): Promise<DirectusType> {
    const flattenError = unwrapDirectusRequestError(error);
    if (flattenError.code === 'RECORD_NOT_UNIQUE') {
      // In some cases, the sync id map may be missing but the item is already in the target table
      // If the ids are preserved, the creation will fail because the id already exists
      // We have to handle this case and recreate the missing id map
      //https://github.com/tractr/directus-sync/issues/92
      if (this.preserveIds) {
        // Check if the id is defined in the payload
        if (!payload.id) {
          throw new Error(
            `Item id is missing in the payload. Previous error: ${flattenError.message}`,
          );
        }
        const [existingItem] = await this.dataClient.query({
          filter: { id: { _eq: payload.id } },
          limit: 1,
        });
        if (!existingItem) {
          throw new Error(
            `Cannot find item that should already exist. Previous error: ${flattenError.message}`,
          );
        }
        this.logger.warn(
          { payload, _syncId },
          `Item ${payload.id} already exists but id map was missing. Will recreate id map.`,
        );
        return existingItem;
      }
    }
    throw error;
  }

  /**
   * This method returns true if there are items to retry.
   */
  protected async update(toUpdate: UpdateItem<DirectusType>[]) {
    const toRetry = [];

    for (const { targetItem, diffItem } of toUpdate) {
      // Try to map the sync id to the local id
      const mappedDiffItem = await this.dataMapper.mapSyncIdToLocalId(diffItem);
      if (!mappedDiffItem) {
        toRetry.push(mappedDiffItem);
        continue;
      }

      // If the id mapping was successful, update the item
      await this.dataClient.update(targetItem.id, mappedDiffItem);
      this.logger.debug(diffItem, `Updated ${targetItem.id}`);
    }

    // Log results
    this.debugOrInfo(
      toUpdate.length > 0,
      `Updated ${toUpdate.length} items`,
    );
    if (toRetry.length) {
      this.logger.warn(
        `Could not update ${toRetry.length} items. Must run again.`,
      );
    }
    return toRetry.length > 0;
  }

  protected async delete(toDelete: IdMap[]) {
    for (const targetItem of toDelete) {
      // There may be no target item if it was deleted manually
      await this.dataClient.delete(targetItem.local_id);
      this.logger.debug(targetItem, `Deleted ${targetItem.local_id}`);
      // Delete entry in the id mapper
      await this.idMapper.removeBySyncId(targetItem.sync_id);
      this.logger.debug(
        {
          syncId: targetItem.sync_id,
          localId: targetItem.id,
        },
        `Deleted id map`,
      );
    }
    this.debugOrInfo(
      toDelete.length > 0,
      `Deleted ${toDelete.length} items`,
    );
  }

  protected async removeDangling(dangling: IdMap[]) {
    for (const danglingItem of dangling) {
      // Delete entry in the id mapper
      await this.idMapper.removeBySyncId(danglingItem.sync_id);
      this.logger.debug(
        {
          syncId: danglingItem.sync_id,
          localId: danglingItem.id,
        },
        `Deleted id map`,
      );
    }
    this.debugOrInfo(
      dangling.length > 0,
      `Deleted ${dangling.length} dangling items`,
    );
  }
}
