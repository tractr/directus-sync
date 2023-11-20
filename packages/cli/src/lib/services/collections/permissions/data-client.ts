import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createPermission,
  deletePermission,
  readPermissions,
  updatePermission,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusPermission } from './interfaces';

@Service()
export class PermissionsDataClient extends DataClient<DirectusPermission> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  /**
   * Returns the admins permissions. These are static permissions that are not stored in the database.
   * We must discard them as they can't be updated and have no id.
   */
  async query<T extends object = DirectusPermission>(
    query: Query<DirectusPermission>,
  ): Promise<T[]> {
    const values = await super.query(query);
    return values.filter((value) => !!value.id) as T[];
  }

  protected getDeleteCommand(itemId: number) {
    return deletePermission(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusPermission>) {
    return createPermission(item);
  }

  protected getQueryCommand(query: Query<DirectusPermission>) {
    return readPermissions({ ...query });
  }

  protected getUpdateCommand(
    itemId: number,
    diffItem: Partial<WithoutIdAndSyncId<DirectusPermission>>,
  ) {
    return updatePermission(itemId, diffItem);
  }
}
