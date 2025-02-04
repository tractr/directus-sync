import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createPolicy,
  deletePolicy,
  readPolicies,
  readPolicy,
  updatePolicy,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import {
  BaseDirectusPolicy,
  DirectusPolicy,
  DirectusPolicyAccess,
} from './interfaces';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { POLICIES_COLLECTION } from './constants';
import deepmerge from 'deepmerge';

@Service()
export class PoliciesDataClient extends DataClient<DirectusPolicy> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, POLICIES_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deletePolicy(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusPolicy>) {
    return createPolicy(item);
  }

  protected getQueryCommand(query: Query<DirectusPolicy>) {
    return readPolicies(
      deepmerge<Query<BaseDirectusPolicy>>(query, {
        fields: ['*', 'roles.role', 'roles.sort'],
      }),
    );
  }

  protected async getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusPolicy>>,
  ) {
    // Explicit update of the roles field (many-to-many relation)
    // Issue : https://github.com/tractr/directus-sync/issues/148
    if (diffItem.roles) {
      // retrieve the access ids
      const accesses = diffItem.roles as Partial<DirectusPolicyAccess>[];
      const rolesAccessesIdsMap = await this.getRolesAccessesIdsMap(itemId);
      for (const access of accesses) {
        if (access.role) {
          access.id = rolesAccessesIdsMap.get(access.role);
        }
      }
      diffItem = {
        ...diffItem,
        roles: {
          update: accesses,
        },
      } as unknown as Partial<DirectusPolicy>;
    }

    return updatePolicy(itemId, diffItem);
  }

  protected async getRolesAccessesIdsMap(
    policyId: string,
  ): Promise<Map<string, number>> {
    const client = await this.migrationClient.get();
    const policy = await client.request(
      readPolicy(policyId, {
        fields: ['roles.id', 'roles.role'],
      }),
    );

    return policy.roles.reduce(
      (
        acc: Map<string, number>,
        access: Pick<DirectusPolicyAccess, 'role' | 'id'>,
      ) => {
        if (access.role) {
          acc.set(access.role, access.id);
        }
        return acc;
      },
      new Map<string, number>(),
    );
  }
}
