import {
  DirectusBaseType,
  DirectusId,
  Field,
  IdMappers,
  StrictField,
  WithSyncIdAndWithoutId,
} from './interfaces';
import { MigrationClient } from '../../migration-client';

export abstract class DataMapper<DT extends DirectusBaseType> {
  /**
   * The user placeholder.
   */
  protected readonly userPlaceholder = '_USER_';

  /**
   * Those fields will be replaced by the migration user id.
   */
  protected usersFields: StrictField<DT>[] = [];

  /**
   * These field will be ignored when comparing the data from the dump with the data from the target table.
   */
  protected fieldsToIgnore: Field<DT>[] = [];

  /**
   * Returns a map of fields and id mapper to use when mapping the ids of the items.
   */
  protected idMappers = {} as IdMappers<DT>;

  constructor(protected readonly migrationClient: MigrationClient) {}

  /**
   * Returns the items with the ids mapped to the sync ids,
   * without the fields to ignore and with the users fields replaced by a placeholder.
   */
  async mapIdsToSyncIdAndRemoveIgnoredFields(
    items: WithSyncIdAndWithoutId<DT>[],
  ): Promise<WithSyncIdAndWithoutId<DT>[]> {
    const output: WithSyncIdAndWithoutId<DT>[] = [];
    for (const item of items) {
      const withoutFields = this.removeFieldsToIgnore(item);
      const withPlaceholder =
        this.replaceUsersFieldsWithPlaceholder(withoutFields);
      const newItem = await this.mapIdsOfItemToSyncId(withPlaceholder);
      output.push(newItem);
    }
    return output;
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
   * Replace the users fields with a placeholder.
   */
  protected replaceUsersFieldsWithPlaceholder(
    item: WithSyncIdAndWithoutId<DT>,
  ): WithSyncIdAndWithoutId<DT> {
    const newItem = { ...item };
    for (const field of this.usersFields) {
      if (Array.isArray(newItem[field])) {
        newItem[field] = (newItem[field] as unknown[]).map(
          () => this.userPlaceholder,
        ) as any;
      } else {
        newItem[field] = this.userPlaceholder as any;
      }
    }
    return newItem;
  }

  /**
   * Map the ids of the item to the sync ids.
   */
  protected async mapIdsOfItemToSyncId(
    item: WithSyncIdAndWithoutId<DT>,
  ): Promise<WithSyncIdAndWithoutId<DT>> {
    const newItem = { ...item };
    for (const entry of Object.entries(this.idMappers)) {
      const field = entry[0] as keyof WithSyncIdAndWithoutId<DT>;
      const idMapper = entry[1];

      if (Array.isArray(newItem[field])) {
        const newIds: string[] = [];
        const ids = (newItem[field] as DirectusId[]) || [];
        for (const id of ids) {
          const idMap = await idMapper.getByLocalId(id.toString());
          if (!idMap) {
            throw new Error(`No id map found for ${id}`);
          }
          newIds.push(idMap.sync_id);
        }
        newItem[field] = newIds as any;
      } else {
        const id = newItem[field] as DirectusId;
        if (id) {
          const idMap = await idMapper.getByLocalId(id.toString());
          if (!idMap) {
            throw new Error(`No id map found for ${id}`);
          }
          newItem[field] = idMap.sync_id;
        }
      }
    }
    return newItem;
  }
}
