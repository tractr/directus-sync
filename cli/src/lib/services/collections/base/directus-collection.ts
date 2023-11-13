import 'dotenv/config';
import { IdMap, IdMapperClient } from './id-mapper-client';
import {
  DirectusBaseType,
  UpdateItem,
  WithoutId,
  WithoutIdAndSyncId,
  WithSyncId,
  WithSyncIdAndWithoutId,
} from './interfaces';
import { DataClient } from './data-client';
import { DataLoader } from './data-loader';
import { DataDiffer } from './data-differ';
import pino from 'pino';
import { DataMapper } from './data-mapper';

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

  constructor(
    protected readonly logger: pino.Logger,
    protected readonly dataDiffer: DataDiffer<DirectusType>,
    protected readonly dataLoader: DataLoader<DirectusType>,
    protected readonly dataClient: DataClient<DirectusType>,
    protected readonly dataMapper: DataMapper<DirectusType>,
    protected readonly idMapper: IdMapperClient,
  ) {}

  /**
   * Pull data from a table to a JSON file
   */
  async pull() {
    const items = await this.dataClient.query({ limit: -1 });
    const mappedItems = await this.mapIdsOfItems(items);
    const itemsWithoutIds = this.removeIdsOfItems(mappedItems);
    this.dataLoader.saveData(itemsWithoutIds);
    this.logger.debug(`Pulled ${mappedItems.length} items.`);
  }

  /**
   * This methods will change ids to sync ids and add users placeholders.
   */
  async postProcessPull() {
    const items = this.dataLoader.getSourceData();
    const mappedItems =
      await this.dataMapper.mapIdsToSyncIdAndRemoveIgnoredFields(items);
    this.dataLoader.saveData(mappedItems);
    this.logger.debug(`Post-processed ${mappedItems.length} items.`);
  }

  async diff() {
    // Get the diff between the dump and the target table and log it
    const { toCreate, toUpdate, toDelete, unchanged, dangling } =
      await this.dataDiffer.getDiff();

    this.logger.info(`Dangling id maps: ${dangling.length} item(s)`);
    for (const idMap of dangling) {
      this.logger.debug(idMap, `Will remove dangling id map`);
    }

    this.logger.info(`To create: ${toCreate.length} item(s)`);
    for (const item of toCreate) {
      this.logger.debug(item, `Will create item`);
    }

    this.logger.info(`To update: ${toUpdate.length} item(s)`);
    for (const { targetItem, diffItem } of toUpdate) {
      this.logger.debug(diffItem, `Will update item (id: ${targetItem.id})`);
    }

    this.logger.info(`To delete: ${toDelete.length} item(s)`);
    for (const item of toDelete) {
      this.logger.debug(item, `Will delete item (id: ${item.id})`);
    }

    this.logger.info(`Unchanged: ${unchanged.length} item(s)`);
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
   * For each item, try to get the mapped id if exists from the idMapper, or create it if not.
   */
  protected async mapIdsOfItems<T extends DirectusBaseType>(
    items: T[],
  ): Promise<WithSyncId<T>[]> {
    const output: WithSyncId<T>[] = [];
    for (const item of items) {
      const syncId = await this.idMapper.getByLocalId(item.id.toString());
      if (syncId) {
        output.push({ ...item, _syncId: syncId.sync_id });
      } else {
        const newSyncId = await this.idMapper.create(item.id);
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
      const newItem = await this.dataClient.create(
        rest as unknown as WithoutIdAndSyncId<DirectusType>,
      );
      this.logger.debug(sourceItem, `Created item`);

      // Create new entry in the id mapper
      const syncId = await this.idMapper.create(newItem.id, _syncId);
      this.logger.debug({ syncId, localId: newItem.id }, `Created id map`);
    }

    // Log results
    this.logger.info(`Created ${toCreate.length} items`);
    if (toRetry.length) {
      this.logger.warn(
        `Could not create ${toRetry.length} items. Must run again.`,
      );
    }
    return toRetry.length > 0;
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
    this.logger.info(`Updated ${toUpdate.length} items`);
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
    this.logger.info(`Deleted ${toDelete.length} items`);
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
    this.logger.info(`Deleted ${dangling.length} dangling items`);
  }
}
