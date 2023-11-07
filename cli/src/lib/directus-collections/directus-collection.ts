import 'dotenv/config';
import { getDumpFilesPaths } from '../helpers';
import path from 'path';
import { Query, RestCommand } from '@directus/sdk';
import { MigrationClient } from '../migration-client';
import { readFileSync, writeFileSync } from 'fs';
import { diff } from 'deep-object-diff';
import { logger } from '../logger';
import { IdMap, IdMapperClient } from './id-mapper-client';

export type DirectusId = number | string;
export type DirectusBaseType = {
  id: DirectusId;
};
export type WithSyncId<T extends DirectusBaseType> = T & {
  _syncId: string;
};
export type WithoutId<T extends DirectusBaseType> = Omit<T, 'id' | '_syncId'>;
export type UpdateItem<T extends DirectusBaseType> = {
  sourceItem: WithSyncId<T>;
  targetItem: WithSyncId<T>;
  diffItem: Partial<WithoutId<T>>;
};

/**
 * This class is responsible for merging the data from a dump to a target table.
 * It creates new data, updates existing data and deletes data that is not present in the dump.
 */
export abstract class DirectusCollection<
  DirectusType extends DirectusBaseType,
> {
  protected readonly dumpPath: string;
  protected readonly filePath: string;

  protected readonly fieldsToIgnore: [
    'id',
    '_syncId',
    ...(keyof WithSyncId<DirectusType>)[],
  ] = ['id', '_syncId'];

  protected abstract readonly enableCreate: boolean;
  protected abstract readonly enableUpdate: boolean;
  protected abstract readonly enableDelete: boolean;

  protected abstract readonly name: string;

  protected readonly idMapper: IdMapperClient;

  constructor() {
    this.idMapper = this.createIdMapperClient();
    this.dumpPath = getDumpFilesPaths().directusDumpPath;
    this.filePath = path.join(this.dumpPath, `${this.name}.json`);
  }

  /**
   * Dump data from a table to a JSON file
   */
  async dump() {
    const directus = await MigrationClient.get();
    const items = await directus.request(this.getQueryCommand({ limit: -1 }));
    const mappedItems = await this.mapIdsOfItems(items);
    writeFileSync(this.filePath, JSON.stringify(mappedItems, null, 2));
    this.debug(`Dumped ${mappedItems.length} items.`);
  }

  async plan() {
    // Get the diff between the dump and the target table and log it
    const { toCreate, toUpdate, toDelete, unchanged, dangling } =
      await this.getDiff();

    this.info(`Dangling id maps: ${dangling.length} item(s)`);
    for (const idMap of dangling) {
      this.debug(`Will remove dangling id map`, idMap);
    }

    this.info(`To create: ${toCreate.length} item(s)`);
    for (const item of toCreate) {
      this.debug(`Will create item`, item);
    }

    this.info(`To update: ${toUpdate.length} item(s)`);
    for (const { targetItem, diffItem } of toUpdate) {
      this.debug(`Will update item (id: ${targetItem.id})`, diffItem);
    }

    this.info(`To delete: ${toDelete.length} item(s)`);
    for (const item of toDelete) {
      this.debug(`Will delete item (id: ${item.id})`, item);
    }

    this.info(`Unchanged: ${unchanged.length} item(s)`);
    for (const item of unchanged) {
      this.debug(`Item ${item.id} is unchanged`);
    }
  }

  /**
   * Merge the data from the dump to the target table
   */
  async restore() {
    const { toCreate, toUpdate, toDelete, dangling } = await this.getDiff();
    // All dangling items should be deleted first
    await this.checkDanglingAndDeleteOverlap(dangling, toDelete);
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

  protected debug(message: string, object?: object) {
    if (object) {
      logger.debug(object, `[${this.name}] ${message}`);
    } else {
      logger.debug(`[${this.name}] ${message}`);
    }
  }

  protected info(message: string) {
    logger.info(`[${this.name}] ${message}`);
  }

  protected error(message: string) {
    logger.error(`[${this.name}] ${message}`);
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

  protected abstract getQueryCommand(
    query: Query<DirectusType, object>,
  ): RestCommand<DirectusType[], object>;

  protected abstract getInsertCommand(
    item: WithoutId<DirectusType>,
  ): RestCommand<DirectusType, object>;

  protected abstract getUpdateCommand(
    sourceItem: DirectusType,
    targetItem: DirectusType,
    diffItem: Partial<WithoutId<DirectusType>>,
  ): RestCommand<DirectusType, object>;

  protected abstract getDeleteCommand(
    itemId: DirectusId,
  ): RestCommand<DirectusType, object>;

  protected abstract getDataMapper(): (
    data: WithSyncId<DirectusType>,
  ) => WithSyncId<DirectusType>;

  /**
   * Returns the source data from the dump file, using readFileSync
   * and passes it through the data transformer.
   * @protected
   */
  protected getSourceData(): WithSyncId<DirectusType>[] {
    const mapper = this.getDataMapper();
    const data = JSON.parse(
      String(readFileSync(this.filePath)),
    ) as WithSyncId<DirectusType>[];
    return data.map(mapper);
  }

  /**
   * Create id mapper client
   */
  protected abstract createIdMapperClient(): IdMapperClient;

  /**
   * Returns the diff between the dump and the target table.
   */
  protected async getDiff() {
    const sourceData = this.getSourceData();

    const toCreate: WithSyncId<DirectusType>[] = [];
    const toUpdate: UpdateItem<DirectusType>[] = [];
    const unchanged: WithSyncId<DirectusType>[] = [];

    for (const sourceItem of sourceData) {
      // Existing item from idMapper
      const targetItem = await this.getTargetItem(sourceItem);
      if (targetItem) {
        const { hasDiff, diffObject } = await this.getDiffBetweenItems(
          sourceItem,
          targetItem,
        );
        if (hasDiff) {
          toUpdate.push({ sourceItem, targetItem, diffItem: diffObject });
        } else {
          unchanged.push(targetItem);
        }
      } else {
        toCreate.push(sourceItem);
      }
    }

    // Get manually deleted ids
    const dangling = await this.getDanglingIds();

    // All data that are not in toUpdate or unchanged should be in toDelete
    const toDelete = await this.getIdsToDelete(unchanged, toUpdate, dangling);

    return { toCreate, toUpdate, toDelete, unchanged, dangling };
  }

  /**
   * Get the target item from the idMapper then from the target table
   */
  protected async getTargetItem(
    sourceItem: WithSyncId<DirectusType>,
  ): Promise<WithSyncId<DirectusType> | undefined> {
    const directus = await MigrationClient.get();
    const idMap = await this.idMapper.getBySyncId(sourceItem._syncId);
    if (idMap) {
      const targetItem = await directus
        .request(this.getQueryCommand({ filter: { id: idMap.id } }))
        .then((items) => items[0])
        .catch(() => {
          logger.warn(
            `Could not find item with id ${idMap.id} in table ${this.name}`,
          );
          return undefined;
        });
      if (targetItem) {
        return { ...targetItem, _syncId: sourceItem._syncId };
      }
    }
    return undefined;
  }

  /**
   * This method will also test every item with the local id from the id mapper.
   * This should be used to find items that were deleted manually and clean up the sync id map.
   */
  protected async getDanglingIds() {
    const directus = await MigrationClient.get();
    const allIdsMap = await this.idMapper.getAll();

    // Find all items that are in the ids map
    const localIds = allIdsMap.map((item) => item.local_id);
    const existingIds = localIds.length
      ? await directus.request<{ id: DirectusId }[]>(
          this.getQueryCommand({
            filter: {
              id: {
                _in: localIds,
              },
            },
            limit: -1,
            fields: ['id'],
          }),
        )
      : [];
    return allIdsMap.filter((item) => {
      return !existingIds.find(
        (existing) => existing.id.toString() === item.local_id,
      );
    });
  }

  /**
   * Denotes which items should be deleted excluding the ones that are to be updated or unchanged.
   * Refer to the list of all items provided by the id mapper.
   */
  protected async getIdsToDelete(
    unchanged: WithSyncId<DirectusType>[],
    toUpdate: UpdateItem<DirectusType>[],
    dangling: IdMap[],
  ) {
    const allIdsMap = await this.idMapper.getAll();

    const toUpdateIds = toUpdate.map(({ targetItem }) => targetItem._syncId);
    const unchangedIds = unchanged.map(({ _syncId }) => _syncId);
    const danglingIds = dangling.map(({ sync_id }) => sync_id);
    const toKeepIds = [...toUpdateIds, ...unchangedIds, ...danglingIds];

    return allIdsMap.filter((item) => !toKeepIds.includes(item.sync_id));
  }

  /**
   * This method ensure there is no dangling ids that are also in the toDelete list.
   * Throws an error if there is.
   */
  protected async checkDanglingAndDeleteOverlap(
    dangling: IdMap[],
    toDelete: IdMap[],
  ) {
    // Ensure that dangling items are not in toDelete
    const danglingToDelete = dangling.filter((danglingItem) => {
      return toDelete.find((item) => item.sync_id === danglingItem.sync_id);
    });
    for (const danglingItem of danglingToDelete) {
      // Log an error if the dangling item is in toDelete
      this.error(`Dangling item is in toDelete: ${danglingItem.sync_id}`);
    }
    if (danglingToDelete.length > 0) {
      throw new Error(
        `Found ${danglingToDelete.length} dangling items that are also in toDelete`,
      );
    }
  }

  /**
   * Get the diff between two items and returns the source item with only the diff fields.
   * This is non-destructive, and non-deep.
   */
  protected async getDiffBetweenItems(
    sourceItem: WithSyncId<DirectusType>,
    targetItem: WithSyncId<DirectusType>,
  ) {
    const diffObject = diff(targetItem, sourceItem) as Partial<
      WithSyncId<DirectusType>
    >;
    for (const field of this.fieldsToIgnore) {
      delete diffObject[field];
    }
    const diffFields = Object.keys(
      diffObject,
    ) as (keyof WithoutId<DirectusType>)[];

    // Compute diff object from source item to avoid transforming the source fields
    const sourceDiffObject = {} as Partial<WithoutId<DirectusType>>;
    for (const field of diffFields) {
      sourceDiffObject[field] = sourceItem[field];
    }

    return {
      diffObject: sourceDiffObject,
      diffFields,
      hasDiff: diffFields.length > 0,
    };
  }

  protected async create(toCreate: WithSyncId<DirectusType>[]) {
    const directus = await MigrationClient.get();
    for (const sourceItem of toCreate) {
      const newItem = await directus.request(this.getInsertCommand(sourceItem));
      this.debug(`Created item`, sourceItem);
      // Create new entry in the id mapper
      const syncId = await this.idMapper.create(newItem.id, sourceItem._syncId);
      this.debug(`Created id map`, { syncId, localId: newItem.id });
    }
    this.info(`Created ${toCreate.length} items`);
  }

  protected async update(toUpdate: UpdateItem<DirectusType>[]) {
    const directus = await MigrationClient.get();
    for (const { sourceItem, targetItem, diffItem } of toUpdate) {
      await directus.request(
        this.getUpdateCommand(sourceItem, targetItem, diffItem),
      );
      this.debug(`Updated ${targetItem.id}`, diffItem);
    }
    this.info(`Updated ${toUpdate.length} items`);
  }

  protected async delete(toDelete: IdMap[]) {
    const directus = await MigrationClient.get();
    for (const targetItem of toDelete) {
      // There may be no target item if it was deleted manually
      await directus.request(this.getDeleteCommand(targetItem.local_id));
      this.debug(`Deleted ${targetItem.local_id}`, targetItem);
      // Delete entry in the id mapper
      await this.idMapper.removeBySyncId(targetItem.sync_id);
      this.debug(`Deleted id map`, {
        syncId: targetItem.sync_id,
        localId: targetItem.id,
      });
    }
    this.info(`Deleted ${toDelete.length} items`);
  }

  protected async removeDangling(dangling: IdMap[]) {
    for (const danglingItem of dangling) {
      // Delete entry in the id mapper
      await this.idMapper.removeBySyncId(danglingItem.sync_id);
      this.debug(`Deleted id map`, {
        syncId: danglingItem.sync_id,
        localId: danglingItem.id,
      });
    }
    this.info(`Deleted ${dangling.length} dangling items`);
  }
}
