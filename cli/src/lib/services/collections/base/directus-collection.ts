import 'dotenv/config';
import { IdMap, IdMapperClient } from './id-mapper-client';
import { DirectusBaseType, UpdateItem, WithSyncId } from './interfaces';
import { DataClient } from './data-client';
import { DataLoader } from './data-loader';
import { DataDiffer } from './data-differ';
import pino from 'pino';

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
    protected readonly idMapper: IdMapperClient,
  ) {}

  /**
   * Dump data from a table to a JSON file
   */
  async dump() {
    const items = await this.dataClient.query({ limit: -1 });
    const mappedItems = await this.mapIdsOfItems(items);
    this.dataLoader.saveData(mappedItems);
    this.logger.debug(`Dumped ${mappedItems.length} items.`);
  }

  async plan() {
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
  async restore() {
    const { toCreate, toUpdate, toDelete, dangling } =
      await this.dataDiffer.getDiff();
    // All dangling items should be deleted first
    await this.removeDangling(dangling);

    if (this.enableCreate) {
      await this.create(toCreate);
    }
    if (this.enableUpdate) {
      await this.update(toUpdate);
    }
    if (this.enableDelete) {
      await this.delete(toDelete);
    }
  }

  /**
   * For each item, try to get the mapped id if exists from the idMapper, or create it if not.
   */
  protected async mapIdsOfItems<T extends DirectusBaseType>(
    items: T[],
  ): Promise<WithSyncId<T>[]> {
    const output: WithSyncId<T>[] = [];
    for (const item of items) {
      const syncId = await this.idMapper.getByLocalId(item.id);
      if (syncId) {
        output.push({ ...item, _syncId: syncId.sync_id });
      } else {
        const newSyncId = await this.idMapper.create(item.id);
        output.push({ ...item, _syncId: newSyncId });
      }
    }
    return output;
  }

  protected async create(toCreate: WithSyncId<DirectusType>[]) {
    for (const sourceItem of toCreate) {
      const newItem = await this.dataClient.create(sourceItem);
      this.logger.debug(sourceItem, `Created item`);
      // Create new entry in the id mapper
      const syncId = await this.idMapper.create(newItem.id, sourceItem._syncId);
      this.logger.debug({ syncId, localId: newItem.id }, `Created id map`);
    }
    this.logger.info(`Created ${toCreate.length} items`);
  }

  protected async update(toUpdate: UpdateItem<DirectusType>[]) {
    for (const { targetItem, diffItem } of toUpdate) {
      await this.dataClient.update(targetItem.id, diffItem);
      this.logger.debug(diffItem, `Updated ${targetItem.id}`);
    }
    this.logger.info(`Updated ${toUpdate.length} items`);
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
