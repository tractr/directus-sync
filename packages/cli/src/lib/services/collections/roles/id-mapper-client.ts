import { IdMap, IdMapperClient } from '../base';
import { Service } from 'typedi';
import { ROLES_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LoggerService } from '../../logger';
import { readMe } from '@directus/sdk';

@Service()
export class RolesIdMapperClient extends IdMapperClient {
  /**
   * This placeholder is used to represent the admin role in the id map.
   */
  protected readonly adminRolePlaceholder = '_sync_default_admin_role';

  protected adminRoleId: string | undefined;

  constructor(migrationClient: MigrationClient, loggerService: LoggerService) {
    super(
      migrationClient,
      loggerService.getChild(ROLES_COLLECTION),
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
      return await super.create(localId, this.adminRolePlaceholder);
    }
    return await super.create(localId, syncId);
  }

  /**
   * Create the sync id of the admin role on the fly, as it already has been synced.
   */
  async getBySyncId(syncId: string): Promise<IdMap | undefined> {
    // Automatically create the default admin role id map if it doesn't exist
    if (syncId === this.adminRolePlaceholder) {
      const idMap = await super.getBySyncId(syncId);
      if (idMap) {
        return idMap;
      }
      const adminRoleId = await this.getAdminRoleId();
      await super.create(adminRoleId, this.adminRolePlaceholder);
      this.logger.debug(
        `Created admin role id map with local id ${adminRoleId}`,
      );
    }
    return await super.getBySyncId(syncId);
  }
}
