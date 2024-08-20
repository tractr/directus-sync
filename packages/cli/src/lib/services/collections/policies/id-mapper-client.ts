import { IdMap, IdMapperClient } from '../base';
import { Inject, Service } from 'typedi';
import { POLICIES_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { RolesIdMapperClient } from '../roles';
import { readPolicies } from '@directus/sdk';

@Service()
export class PoliciesIdMapperClient extends IdMapperClient {
  protected adminPolicyFetched = false;
  protected adminPolicyId: string | undefined;
  protected readonly adminPolicyPlaceholder = '_sync_default_admin_policy';

  protected publicPolicyFetched = false;
  protected publicPolicyId: string | undefined;
  protected readonly publicPolicyPlaceholder = '_sync_default_public_policy';

  constructor(
    migrationClient: MigrationClient,
    @Inject(LOGGER) baseLogger: pino.Logger,
    protected readonly rolesIdMapperClient: RolesIdMapperClient,
  ) {
    super(
      migrationClient,
      getChildLogger(baseLogger, POLICIES_COLLECTION),
      POLICIES_COLLECTION,
    );
  }

  /**
   * Force admin and public policies placeholders for the admin and public policies.
   */
  async create(localId: string | number, syncId?: string): Promise<string> {
    const adminPolicyId = await this.getAdminPolicyId();
    if (localId === adminPolicyId) {
      return await super.create(localId, this.adminPolicyPlaceholder);
    }
    const publicPolicyId = await this.getPublicPolicyId();
    if (localId === publicPolicyId) {
      return await super.create(localId, this.publicPolicyPlaceholder);
    }
    return await super.create(localId, syncId);
  }

  /**
   * Create the sync id of the admin and public policies on the fly, as it already has been synced.
   */
  async getBySyncId(syncId: string): Promise<IdMap | undefined> {
    const idMap = await super.getBySyncId(syncId);
    if (!idMap) {
      // Automatically create the default admin policy id map if it doesn't exist
      if (syncId === this.adminPolicyPlaceholder) {
        const adminPolicyId = await this.getAdminPolicyId();
        if (adminPolicyId) {
          await super.create(adminPolicyId, this.adminPolicyPlaceholder);
          this.logger.debug(
            `Created admin policy id map with local id ${adminPolicyId}`,
          );
          return await super.getBySyncId(syncId);
        }
      }

      // Automatically create the default public policy id map if it doesn't exist
      else if (syncId === this.publicPolicyPlaceholder) {
        const publicPolicyId = await this.getPublicPolicyId();
        if (publicPolicyId) {
          await super.create(publicPolicyId, this.publicPolicyPlaceholder);
          this.logger.debug(
            `Created public policy id map with local id ${publicPolicyId}`,
          );
          return await super.getBySyncId(syncId);
        }
      }
    }
    return idMap;
  }

  /**
   * Returns the default admin policy, attached to the admin role.
   */
  protected async getAdminPolicyId() {
    if (!this.adminPolicyFetched) {
      const directus = await this.migrationClient.get();
      const adminRoleId = await this.rolesIdMapperClient.getAdminRoleId();
      const [policy] = await directus.request(
        readPolicies({
          fields: ['id'],
          filter: {
            _and: [
              // @ts-ignore TODO: Bad SDK Typing
              { roles: { role: { _eq: adminRoleId } } },
              { admin_access: { _eq: true } },
            ],
          },
          limit: 1,
        }),
      );

      if (!policy) {
        this.logger.debug(
          'Cannot find the admin policy attached to the admin role',
        );
      }

      this.adminPolicyId = policy?.id;
      this.adminPolicyFetched = true;
    }
    return this.adminPolicyId;
  }

  /**
   * Returns the default public policy, where role = null
   */
  protected async getPublicPolicyId() {
    if (!this.publicPolicyFetched) {
      const directus = await this.migrationClient.get();
      const [policy] = await directus.request(
        readPolicies({
          fields: ['id'],
          filter: {
            _and: [
              // @ts-ignore TODO: Bad SDK Typing
              { roles: { role: { _null: true } } },
              // @ts-ignore TODO: Bad SDK Typing
              { roles: { sort: { _eq: 1 } } },
            ],
          },
          limit: 1,
        }),
      );

      if (!policy) {
        this.logger.debug('Cannot find the public policy');
      }

      this.publicPolicyId = policy?.id;
      this.publicPolicyFetched = true;
    }
    return this.publicPolicyId;
  }
}
