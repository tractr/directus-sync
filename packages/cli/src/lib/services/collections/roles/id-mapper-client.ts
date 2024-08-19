import { IdMap, IdMapperClient } from '../base';
import { Inject, Service } from 'typedi';
import { ROLES_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';

@Service()
export class RolesIdMapperClient extends IdMapperClient {
  /**
   * This placeholder is used to represent the admin role in the id map.
   */
  protected readonly adminRolePlaceholder = '__admin__';

  constructor(
    migrationClient: MigrationClient,
    @Inject(LOGGER) baseLogger: pino.Logger,
  ) {
    super(
      migrationClient,
      getChildLogger(baseLogger, ROLES_COLLECTION),
      ROLES_COLLECTION,
    );
  }

  /**
   * The admin role is a special case, it cannot be synced.
   * This method returns a placeholder for the admin role.
   */
  async getByLocalId(localId: string): Promise<IdMap | undefined> {
    const adminRoleId = await this.migrationClient.getAdminRoleId();
    if (localId === adminRoleId) {
      return this.getAdminRoleIdMap();
    }
    return super.getByLocalId(localId);
  }

  /**
   * The admin role is a special case, it cannot be synced.
   * This method returns the real id of the admin role.
   */
  getBySyncId(syncId: string): Promise<IdMap | undefined> {
    if (syncId === this.adminRolePlaceholder) {
      return this.getAdminRoleIdMap();
    }
    return super.getBySyncId(syncId);
  }

  protected async getAdminRoleIdMap(): Promise<IdMap> {
    const adminRoleId = await this.migrationClient.getAdminRoleId();
    return {
      id: 0,
      table: ROLES_COLLECTION,
      sync_id: this.adminRolePlaceholder,
      local_id: adminRoleId,
      created_at: new Date(),
    };
  }
}
