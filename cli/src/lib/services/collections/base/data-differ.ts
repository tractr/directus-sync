import {
  DirectusBaseType,
  DirectusId,
  UpdateItem,
  WithoutIdAndSyncId,
  WithSyncId,
  WithSyncIdAndWithoutId,
} from './interfaces';
import { IdMap, IdMapperClient } from './id-mapper-client';
import { diff } from 'deep-object-diff';
import { DataLoader } from './data-loader';
import { DataClient } from './data-client';
import pino from 'pino';
import { DataMapper } from './data-mapper';

export abstract class DataDiffer<DirectusType extends DirectusBaseType> {
  protected readonly fieldsToIgnore: [
    'id',
    '_syncId',
    ...(keyof WithSyncId<DirectusType>)[],
  ] = ['id', '_syncId'];

  constructor(
    protected readonly logger: pino.Logger,
    protected readonly dataLoader: DataLoader<DirectusType>,
    protected readonly dataClient: DataClient<DirectusType>,
    protected readonly dataMapper: DataMapper<DirectusType>,
    protected readonly idMapper: IdMapperClient,
  ) {}

  /**
   * Returns the diff between the dump and the target table.
   */
  async getDiff() {
    const sourceData = this.dataLoader.getSourceData();

    const toCreate: WithSyncIdAndWithoutId<DirectusType>[] = [];
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

    // Ensure that dangling items are not in toDelete
    await this.checkDanglingAndDeleteOverlap(dangling, toDelete);

    return { toCreate, toUpdate, toDelete, unchanged, dangling };
  }

  /**
   * Get the target item from the idMapper then from the target table
   */
  protected async getTargetItem(
    sourceItem: WithSyncIdAndWithoutId<DirectusType>,
  ): Promise<WithSyncId<DirectusType> | undefined> {
    const idMap = await this.idMapper.getBySyncId(sourceItem._syncId);
    if (idMap) {
      const targetItem = await this.dataClient
        .query({ filter: { id: idMap.local_id } })
        .then((items) => items[0])
        .catch(() => {
          this.logger.warn(`Could not find item with id ${idMap.id}`);
          return undefined;
        });
      if (targetItem) {
        const withSyncId = { ...targetItem, _syncId: sourceItem._syncId };
        const [withMappedIds] =
          await this.dataMapper.mapIdsToSyncIdAndRemoveIgnoredFields([
            withSyncId,
          ]);
        return {
          ...withMappedIds,
          id: targetItem.id,
        } as WithSyncId<DirectusType>;
      }
    }
    return undefined;
  }

  /**
   * This method will also test every item with the local id from the id mapper.
   * This should be used to find items that were deleted manually and clean up the sync id map.
   */
  protected async getDanglingIds() {
    const allIdsMap = await this.idMapper.getAll();

    // Find all items that are in the ids map
    const localIds = allIdsMap.map((item) => item.local_id);
    const existingIds = localIds.length
      ? await this.dataClient.query<{ id: DirectusId }>({
          filter: {
            id: {
              _in: localIds,
            },
          },
          limit: -1,
          fields: ['id'],
        })
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
      this.logger.error(
        `Dangling item is in toDelete: ${danglingItem.sync_id}`,
      );
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
    sourceItem: WithSyncIdAndWithoutId<DirectusType>,
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
    ) as (keyof WithoutIdAndSyncId<DirectusType>)[];

    // Compute diff object from source item to avoid transforming the source fields
    const sourceDiffObject = {} as Partial<WithoutIdAndSyncId<DirectusType>>;
    for (const field of diffFields) {
      sourceDiffObject[field] = (sourceItem as WithSyncId<DirectusType>)[field];
    }

    return {
      diffObject: sourceDiffObject,
      diffFields,
      hasDiff: diffFields.length > 0,
    };
  }
}
