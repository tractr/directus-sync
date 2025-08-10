import {
  DirectusId,
  Field,
  IdMappers,
  WithSyncIdAndWithoutId,
} from './interfaces';
import { IdMapperClient } from './id-mapper-client';
import { applyMappers, bindMappers, Item, MapperRecord } from './helpers';
import { Logger } from '../../logger';

export abstract class DataMapper<T> {
  /**
   * These field will be ignored when saving and restoring the data.
   */
  protected fieldsToIgnore: Field<T, string>[] = [];

  /**
   * Returns a map of fields and id mapper to use when mapping the ids of the items.
   */
  protected idMappers = {} as IdMappers<T>;

  /**
   * Computed mapper functions from local to sync id from the id mappers.
   */
  protected localIdToSyncIdMappers: MapperRecord | undefined;

  /**
   * Computed mapper functions from sync to local id from the id mappers.
   */
  protected syncIdToLocalIdMappers: MapperRecord | undefined;

  constructor(protected readonly logger: Logger) {}

  /**
   * Returns the items with the ids mapped to the sync ids,
   * without the fields to ignore.
   */
  async mapIdsToSyncIdAndRemoveIgnoredFields(
    items: WithSyncIdAndWithoutId<T>[],
  ): Promise<WithSyncIdAndWithoutId<T>[]> {
    const output: WithSyncIdAndWithoutId<T>[] = [];
    for (const item of items) {
      const withoutFields = this.removeFieldsToIgnore(item);
      const newItem = await this.mapLocalIdToSyncIdIfPossible(withoutFields);
      output.push(newItem);
    }
    return output;
  }

  /**
   * Discard the fields to ignore from the items.
   */
  protected removeFieldsToIgnore(
    item: WithSyncIdAndWithoutId<T>,
  ): WithSyncIdAndWithoutId<T> {
    const newItem = { ...item };
    for (const field of this.fieldsToIgnore) {
      delete newItem[field as keyof typeof newItem];
    }
    return newItem;
  }

  /**
   * Map the sync id of the item to the local id.
   * Returns undefined if the item has no sync id.
   * This allows to create items by order of dependencies.
   */
  async mapSyncIdToLocalId<T extends Item>(item: T): Promise<T | undefined> {
    return await applyMappers(item, this.getSyncIdToLocalIdMapper());
  }

  /**
   * Build once the mapper functions from sync to local id.
   */
  protected getSyncIdToLocalIdMapper(): MapperRecord {
    if (!this.syncIdToLocalIdMappers) {
      const callback =
        (idMapper: IdMapperClient, field: string) => async (id: DirectusId) => {
          if (this.isDynamicId(id)) {
            this.logger.debug(
              `Value '${id}' for field '${field}' is dynamic, skipping mapping.`,
            );
            return id;
          }
          const idMap = await idMapper.getBySyncId(id.toString());
          if (!idMap) {
            this.logger.warn(
              `No id map found for ${field}:${id}, will try on the next round`,
            );
            return undefined;
          }
          return idMap.local_id as DirectusId;
        };
      const predicate = (value: unknown) =>
        typeof value === 'object' && !(value instanceof IdMapperClient);

      this.syncIdToLocalIdMappers = bindMappers(
        this.idMappers,
        callback,
        predicate,
      );
    }

    return this.syncIdToLocalIdMappers;
  }

  /**
   * Returns true if the id is dynamic, i.e. it is a template.
   */
  protected isDynamicId(id: DirectusId): boolean {
    return id.toString().trim().startsWith('{{');
  }

  /**
   * Map the ids of the item to the sync ids.
   * For new items, the original id is used.
   */
  protected async mapLocalIdToSyncIdIfPossible<T extends Item>(
    item: T,
  ): Promise<T> {
    const output = await applyMappers(item, this.getLocalIdToSyncIdMapper());
    if (!output) {
      throw new Error('A mapper returned undefined. This should not happen.');
    }
    return output;
  }

  /**
   * Build once the mapper functions from local to sync id.
   */
  protected getLocalIdToSyncIdMapper(): MapperRecord {
    if (!this.localIdToSyncIdMappers) {
      const callback =
        (idMapper: IdMapperClient, field: string) => async (id: DirectusId) => {
          const idMap = await idMapper.getByLocalId(id.toString());
          if (!idMap) {
            this.logger.debug(`No id map found for ${field}:${id}`);
            return id;
          }
          return idMap.sync_id as DirectusId;
        };
      const predicate = (value: unknown) =>
        typeof value === 'object' && !(value instanceof IdMapperClient);

      this.localIdToSyncIdMappers = bindMappers(
        this.idMappers,
        callback,
        predicate,
      );
    }

    return this.localIdToSyncIdMappers;
  }
}
