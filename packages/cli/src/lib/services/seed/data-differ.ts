import {
  DirectusId,
  DirectusUnknownType,
  WithSyncId,
  WithSyncIdAndWithoutId,
  IdMap,
  IdMapperClient,
} from '../collections';
import { SeedDataClient } from './data-client';
import { SeedDataMapper } from './data-mapper';
import pino from 'pino';
import { Container } from 'typedi';
import { LOGGER } from '../../constants';
import { getChildLogger } from '../../helpers';
import { diff } from 'deep-object-diff';
import { SnapshotClient } from '../snapshot';

export class SeedDataDiffer {
  protected readonly fieldsToIgnore: string[] = ['id', '_syncId'];
  protected sourceData: WithSyncIdAndWithoutId<DirectusUnknownType>[] = [];
  protected readonly logger: pino.Logger;
  protected readonly snapshotClient: SnapshotClient;

  constructor(
    protected readonly collection: string,
    protected readonly dataClient: SeedDataClient,
    protected readonly dataMapper: SeedDataMapper,
    protected readonly idMapper: IdMapperClient,
  ) {
    const baseLogger = Container.get<pino.Logger>(LOGGER);
    this.logger = getChildLogger(baseLogger, `Differ:${collection}`);
    this.snapshotClient = Container.get(SnapshotClient);
  }

  /**
   * Set the source data to compare with the target data
   */
  setSourceData(data: WithSyncIdAndWithoutId<DirectusUnknownType>[]) {
    this.sourceData = data;
  }

  /**
   * Get the target item from the idMapper then from the target table
   */
  protected async getTargetItem(
    sourceItem: WithSyncIdAndWithoutId<DirectusUnknownType>,
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

      const withSyncId = { ...targetItem, _syncId: sourceItem._syncId };
      const [withMappedIds] =
        await this.dataMapper.mapIdsToSyncIdAndRemoveIgnoredFields([
          withSyncId,
        ]);

      return {
        ...withMappedIds,
        id: idMap.local_id,
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
  protected getDiffBetweenItems(
    sourceItem: WithSyncIdAndWithoutId<DirectusUnknownType>,
    targetItem: WithSyncId<DirectusUnknownType>,
  ) {
    const diffObject = diff(targetItem, sourceItem) as Partial<
      WithSyncId<DirectusUnknownType>
    >;

    for (const field of this.fieldsToIgnore) {
      delete diffObject[field];
    }

    const diffFields = Object.keys(diffObject);
    const sourceDiffObject = {} as Partial<
      WithSyncIdAndWithoutId<DirectusUnknownType>
    >;

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
  protected async getDanglingIds(): Promise<IdMap[]> {
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
      existingIds.add(await this.getPrimaryKey(item));
    }

    return allIdsMap.filter((item) => !existingIds.has(item.local_id));
  }

  /**
   * Get items that should be deleted
   */
  protected async getIdsToDelete(
    unchanged: WithSyncId<DirectusUnknownType>[],
    toUpdate: Array<{
      sourceItem: WithSyncIdAndWithoutId<DirectusUnknownType>;
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

  /**
   * Get the diff between source data and target data
   */
  async getDiff() {
    const toCreate: WithSyncIdAndWithoutId<DirectusUnknownType>[] = [];
    const toUpdate: Array<{
      sourceItem: WithSyncIdAndWithoutId<DirectusUnknownType>;
      targetItem: WithSyncId<DirectusUnknownType>;
      diffItem: Partial<WithSyncIdAndWithoutId<DirectusUnknownType>>;
    }> = [];
    const unchanged: WithSyncId<DirectusUnknownType>[] = [];

    for (const sourceItem of this.sourceData) {
      const targetItem = await this.getTargetItem(sourceItem);
      if (targetItem) {
        const { hasDiff, diffObject } = this.getDiffBetweenItems(
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
}
