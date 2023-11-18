import { DataClient, WithoutIdAndSyncId } from '../base';
import {
  createPermission,
  deletePermission,
  DirectusPermission,
  Query,
  readPermissions,
  updatePermission,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';

@Service()
export class PermissionsDataClient extends DataClient<
  DirectusPermission<object>
> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  /**
   * Returns the admins permissions. These are static permissions that are not stored in the database.
   * We must discard them as they can't be updated and have no id.
   */
  async query<T extends object = DirectusPermission<object>>(
    query: Query<DirectusPermission<object>, object>,
  ): Promise<T[]> {
    const values = await super.query(query);
    return values.filter((value) => !!value.id) as T[];
  }

  protected getDeleteCommand(itemId: number) {
    return deletePermission(itemId);
  }

  protected getInsertCommand(
    item: WithoutIdAndSyncId<DirectusPermission<object>>,
  ) {
    return createPermission(item);
  }

  protected getQueryCommand(query: Query<DirectusPermission<object>, object>) {
    return readPermissions({ ...query });
  }

  protected getUpdateCommand(
    itemId: number,
    diffItem: Partial<WithoutIdAndSyncId<DirectusPermission<object>>>,
  ) {
    return updatePermission(itemId, diffItem);
  }
}
