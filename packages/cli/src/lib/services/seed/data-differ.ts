import { DirectusId, WithSyncId, IdMap } from '../collections';
import { DirectusUnknownType } from '../interfaces';
import { SeedDataClient } from './data-client';
import { SeedDataMapper } from './data-mapper';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { COLLECTION, LOGGER, META } from '../../constants';
import { getChildLogger } from '../../helpers';
import { diff } from 'deep-object-diff';
import { SnapshotClient } from '../snapshot';
import { SeedMeta } from './interfaces';
import { Cacheable } from 'typescript-cacheable';
import {
  SeedIdMapperClient,
  SeedIdMapperClientFactory,
} from './id-mapper-client';

@Service()
export class SeedDataDiffer {
  protected readonly logger: pino.Logger;
  protected readonly idMapper: SeedIdMapperClient;

  constructor(
    @Inject(LOGGER) protected readonly baseLogger: pino.Logger,
    @Inject(COLLECTION) protected readonly collection: string,
    @Inject(META) protected readonly meta: SeedMeta,
    protected readonly dataClient: SeedDataClient,
    protected readonly dataMapper: SeedDataMapper,
    protected readonly idMapperFactory: SeedIdMapperClientFactory,
    protected readonly snapshotClient: SnapshotClient,
  ) {
    this.logger = getChildLogger(baseLogger, collection);
    this.idMapper = this.idMapperFactory.forCollection(collection);
  }

  /**
   * Get fields to ignore
   * Keep the response in cache
   */
  @Cacheable()
  protected async getFieldsToIgnore() {
    return [await this.getPrimaryFieldName(), '_syncId'];
  }

  /**
   * Get the diff between source data and target data
   */
  async getDiff(data: WithSyncId<DirectusUnknownType>[]) {
    const toCreate: WithSyncId<DirectusUnknownType>[] = [];
    const toUpdate: Array<{
      sourceItem: WithSyncId<DirectusUnknownType>;
      targetItem: WithSyncId<DirectusUnknownType>;
      diffItem: Partial<WithSyncId<DirectusUnknownType>>;
    }> = [];
    const unchanged: WithSyncId<DirectusUnknownType>[] = [];

    for (const sourceItem of data) {
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

    // Get items to delete
    const toDelete = await this.getIdsToDelete(unchanged, toUpdate, dangling);

    return { toCreate, toUpdate, toDelete, unchanged, dangling };
  }

  /**
   * Get the target item from the idMapper then from the target table
   */
  protected async getTargetItem(
    sourceItem: WithSyncId<DirectusUnknownType>,
  ): Promise<WithSyncId<DirectusUnknownType> | undefined> {
    const idMap = await this.idMapper.getBySyncId(sourceItem._syncId);
    if (!idMap) {
      return undefined;
    }

    try {
      const [targetItem] = await this.dataClient.queryByPrimaryField(
        idMap.local_id,
      );

      if (!targetItem) {
        return undefined;
      }

      // Remove all fields that are not in the source item
      const targetItemWithoutFields = Object.keys(sourceItem).reduce(
        (acc, field) => {
          acc[field] = targetItem[field];
          return acc;
        },
        {} as DirectusUnknownType,
      );

      const withSyncId = {
        ...targetItemWithoutFields,
        _syncId: sourceItem._syncId,
      };
      const [withMappedIds] =
        await this.dataMapper.mapIdsToSyncIdAndRemoveIgnoredFields([
          withSyncId,
        ]);
      const primaryFieldName = await this.getPrimaryFieldName();
      return {
        ...withMappedIds,
        [primaryFieldName]: idMap.local_id,
      } as WithSyncId<DirectusUnknownType>;
    } catch (error) {
      this.logger.warn(
        { error, idMap },
        `Could not find item with id ${idMap.local_id}`,
      );
      return undefined;
    }
  }

  /**
   * Get the diff between two items and returns the source item with only the diff fields
   */
  protected async getDiffBetweenItems(
    sourceItem: WithSyncId<DirectusUnknownType>,
    targetItem: WithSyncId<DirectusUnknownType>,
  ) {
    const diffObject = diff(targetItem, sourceItem) as Partial<
      WithSyncId<DirectusUnknownType>
    >;

    const fieldsToIgnore = await this.getFieldsToIgnore();
    for (const field of fieldsToIgnore) {
      delete diffObject[field];
    }

    const diffFields = Object.keys(diffObject);
    const sourceDiffObject = {} as Partial<WithSyncId<DirectusUnknownType>>;

    for (const field of diffFields) {
      sourceDiffObject[field] = sourceItem[field];
    }

    return {
      diffObject: sourceDiffObject,
      hasDiff: diffFields.length > 0,
    };
  }

  /**
   * Get manually deleted items
   */
  async getDanglingIds(): Promise<IdMap[]> {
    const allIdsMap = await this.idMapper.getAll();
    const localIds = allIdsMap.map((item) => item.local_id);

    if (!localIds.length) {
      return [];
    }

    const primaryFieldName = await this.getPrimaryFieldName();
    const existingItems = await this.dataClient.queryByPrimaryField(localIds, {
      limit: -1,
      fields: [primaryFieldName],
    });
    const existingIds = new Set<DirectusId>();
    for (const item of existingItems) {
      const primaryKey = await this.getPrimaryKey(item);
      existingIds.add(primaryKey.toString());
    }

    return allIdsMap.filter((item) => !existingIds.has(item.local_id));
  }

  /**
   * Get items that should be deleted
   */
  protected async getIdsToDelete(
    unchanged: WithSyncId<DirectusUnknownType>[],
    toUpdate: Array<{
      sourceItem: WithSyncId<DirectusUnknownType>;
      targetItem: WithSyncId<DirectusUnknownType>;
    }>,
    dangling: IdMap[],
  ): Promise<IdMap[]> {
    const allIdsMap = await this.idMapper.getAll();
    const toKeepIds = new Set([
      ...unchanged.map((item) => item._syncId),
      ...toUpdate.map(({ targetItem }) => targetItem._syncId),
      ...dangling.map((item) => item.sync_id),
    ]);

    return allIdsMap.filter((item) => !toKeepIds.has(item.sync_id));
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
   * Get the primary field name from the collection
   */
  protected async getPrimaryFieldName(): Promise<string> {
    return (await this.snapshotClient.getPrimaryField(this.collection)).name;
  }
}
