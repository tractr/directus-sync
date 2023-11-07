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

  protected readonly idMapper: IdMapperClient;

  constructor(protected readonly name: string) {
    this.idMapper = this.createIdMapperClient();
    this.dumpPath = getDumpFilesPaths().directusDumpPath;
    this.filePath = path.join(this.dumpPath, `${this.name}.json`);
  }

  /**
   * Dump data from a table to a JSON file
   */
  async dump() {
    const directus = await MigrationClient.get();
    const items = await directus.request(this.getQueryCommand({}));
    const mappedItems = await this.mapIdsOfItems(items);
    writeFileSync(this.filePath, JSON.stringify(mappedItems, null, 2));
    this.debug(`Dumped ${mappedItems.length} items.`);
  }

  async plan() {
    // Get the diff between the dump and the target table and log it
    const { toCreate, toUpdate, toDelete, unchanged } = await this.getDiff();

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
    const { toCreate, toUpdate, toDelete } = await this.getDiff();
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

  protected abstract getByIdCommand(
    id: DirectusId,
  ): RestCommand<DirectusType, object>;

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

    // All data that are not in toUpdate or unchanged should be in toDelete
    const toDelete = await this.getIdsToDelete(unchanged, toUpdate);

    return { toCreate, toUpdate, toDelete, unchanged };
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
      const targetItem = await directus.request(this.getByIdCommand(idMap.id));
      return { ...targetItem, _syncId: sourceItem._syncId };
    }
    return undefined;
  }

  /**
   * Denotes which items should be deleted excluding the ones that are to be updated or unchanged.
   * Refer to the list of all items provided by the id mapper.
   */
  protected async getIdsToDelete(
    unchanged: WithSyncId<DirectusType>[],
    toUpdate: UpdateItem<DirectusType>[],
  ) {
    const toUpdateIds = toUpdate.map(({ targetItem }) => targetItem._syncId);
    const unchangedIds = unchanged.map(({ _syncId }) => _syncId);
    const toKeepIds = [...toUpdateIds, ...unchangedIds];
    return (await this.idMapper.getAll()).filter(
      (item) => !toKeepIds.includes(item.sync_id),
    );
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
}
