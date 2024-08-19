import { IdMap, IdMapperClient } from '../base';
import { Inject, Service } from 'typedi';
import { ROLES_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { readMe } from '@directus/sdk';

@Service()
export class RolesIdMapperClient extends IdMapperClient {
  /**
   * This placeholder is used to represent the admin role in the id map.
   */
  protected readonly adminRolePlaceholder = '$sync:default_admin_role';

  protected adminRoleId: string | undefined;

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
   * This method return the role of the current user as the Admin role
   */
  async getAdminRoleId() {
    if (!this.adminRoleId) {
      const directus = await this.migrationClient.get();
      const { role } = await directus.request(
        readMe({
          fields: ['role'],
        }),
      );
      this.adminRoleId = role as string;
    }
    return this.adminRoleId;
  }

  /**
   * Force admin role placeholder for the admin role.
   */
  async create(localId: string | number, syncId?: string): Promise<string> {
    const adminRoleId = await this.getAdminRoleId();
    if (localId === adminRoleId) {
      return super.create(localId, this.adminRolePlaceholder);
    }
    return super.create(localId, syncId);
  }

  /**
   * Create the sync id of the admin role on the fly, as it already has been synced.
   */
  async getBySyncId(syncId: string): Promise<IdMap | undefined> {
    const idMap = super.getBySyncId(syncId);
    // Automatically create the default admin role id map if it doesn't exist
    if (!idMap && syncId === this.adminRolePlaceholder) {
      const adminRoleId = await this.getAdminRoleId();
      await this.create(adminRoleId);
      this.logger.debug(
        `Created admin role id map with local id ${adminRoleId}`,
      );
      return this.getBySyncId(syncId);
    }
    return idMap;
  }
}
