import {
  DirectusBaseType,
  DirectusId,
  Field,
  IdMappers,
  WithSyncIdAndWithoutId,
} from './interfaces';
import pino from 'pino';
import { IdMapperClient } from './id-mapper-client';

export abstract class DataMapper<DT extends DirectusBaseType> {
  /**
   * These field will be ignored when comparing the data from the dump with the data from the target table.
   */
  protected fieldsToIgnore: Field<DT, string>[] = [];

  /**
   * Returns a map of fields and id mapper to use when mapping the ids of the items.
   */
  protected idMappers = {} as IdMappers<DT>;

  constructor(protected readonly logger: pino.Logger) {}

  /**
   * Returns the items with the ids mapped to the sync ids,
   * without the fields to ignore.
   */
  async mapIdsToSyncIdAndRemoveIgnoredFields(
    items: WithSyncIdAndWithoutId<DT>[],
  ): Promise<WithSyncIdAndWithoutId<DT>[]> {
    const output: WithSyncIdAndWithoutId<DT>[] = [];
    for (const item of items) {
      const withoutFields = this.removeFieldsToIgnore(item);
      const newItem = await this.mapLocalIdToSyncIdIfPossible(withoutFields);
      output.push(newItem);
    }
    return output;
  }

  /**
   * Map the sync id of the item to the local id.
   * Returns undefined if the item has no sync id.
   * This allows to create items by order of dependencies.
   */
  async mapSyncIdToLocalId<T>(item: T): Promise<T | undefined> {
    const newItem = { ...item };
    for (const entry of Object.entries(this.idMappers)) {
      const field = entry[0] as keyof T;
      const idMapper: IdMapperClient = entry[1];

      if (Array.isArray(newItem[field])) {
        throw new Error('Mapping ids for array is not supported');
      }

      const id = newItem[field] as string;
      if (id) {
        const idMap = await idMapper.getBySyncId(id);
        if (!idMap) {
          this.logger.warn(
            `No id map found for ${id}, will try on the next round`,
          );
          return undefined;
        }
        newItem[field] = idMap.local_id as T[keyof T];
      }
    }
    return newItem;
  }

  /**
   * Discard the fields to ignore from the items.
   */
  protected removeFieldsToIgnore(
    item: WithSyncIdAndWithoutId<DT>,
  ): WithSyncIdAndWithoutId<DT> {
    const newItem = { ...item };
    for (const field of this.fieldsToIgnore) {
      delete newItem[field as keyof typeof newItem];
    }
    return newItem;
  }

  /**
   * Map the ids of the item to the sync ids.
   * For new items, the original id is used.
   */
  protected async mapLocalIdToSyncIdIfPossible<T>(item: T): Promise<T> {
    const newItem = { ...item };
    for (const entry of Object.entries(this.idMappers)) {
      const field = entry[0] as keyof T;
      const idMapper: IdMapperClient = entry[1];

      if (Array.isArray(newItem[field])) {
        throw new Error('Mapping ids for array is not supported');
      }
      const id = newItem[field] as DirectusId;
      if (id) {
        const idMap = await idMapper.getByLocalId(id.toString());
        if (idMap) {
          newItem[field] = idMap.sync_id as T[keyof T];
        } else {
          this.logger.debug(`No id map found for ${field as string}:${id}`);
        }
      }
    }
    return newItem;
  }
}
