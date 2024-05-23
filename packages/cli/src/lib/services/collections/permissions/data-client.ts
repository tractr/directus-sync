import { Command, DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createPermission,
  deletePermission,
  deletePermissions,
  readPermissions,
  updatePermission,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusPermission } from './interfaces';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { PERMISSIONS_COLLECTION } from './constants';

@Service()
export class PermissionsDataClient extends DataClient<DirectusPermission> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, PERMISSIONS_COLLECTION), migrationClient);
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

  protected async getInsertCommand(
    item: WithoutIdAndSyncId<DirectusPermission>,
  ) {
    // Check if a similar permission already exists and remove it
    // Discussed in https://github.com/directus/directus/issues/21965
    const directus = await this.migrationClient.get();
    const permissions = await directus.request(
      readPermissions({
        filter: {
          role: item.role ? { _eq: item.role as string } : { _null: true },
          collection: { _eq: item.collection },
          action: { _eq: item.action },
        },
        fields: ['id'],
      }),
    );
    const existingPermissions = permissions.map((p) => p.id).filter(Boolean);

    if (existingPermissions.length) {
      this.logger.warn(
        `Found duplicate permissions for ${item.collection}.${item.action} with role ${(item.role as string) ?? 'null'}. Deleting them.`,
      );
      return [
        deletePermissions(existingPermissions),
        createPermission(item),
      ] as [...Command<object>[], Command<DirectusPermission>];
    }

    return createPermission(item);
  }

  protected getQueryCommand(query: Query<DirectusPermission>) {
    return readPermissions({ ...query } as Query<DirectusPermission>);
  }

  protected getUpdateCommand(
    itemId: number,
    diffItem: Partial<WithoutIdAndSyncId<DirectusPermission>>,
  ) {
    return updatePermission(itemId, diffItem);
  }
}
