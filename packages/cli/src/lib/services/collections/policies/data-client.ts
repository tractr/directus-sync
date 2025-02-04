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
  PolicyRolesDiff,
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
      const rolesDiff = await this.getRolesDiff(
        itemId,
        diffItem.roles as Partial<DirectusPolicyAccess>[],
      );
      if (!this.isRolesDiffEmpty(rolesDiff)) {
        diffItem = {
          ...diffItem,
          roles: rolesDiff,
        } as unknown as Partial<DirectusPolicy>;
      }
    }

    return updatePolicy(itemId, diffItem);
  }

  private isRolesDiffEmpty(diff: PolicyRolesDiff) {
    return (
      diff.create.length === 0 &&
      diff.update.length === 0 &&
      diff.delete.length === 0
    );
  }

  protected async getRolesDiff(
    itemId: string,
    accesses: Partial<DirectusPolicyAccess>[],
  ): Promise<PolicyRolesDiff> {
    const rolesAccessesIdsMap = await this.getRolesAccessesIdsMap(itemId);

    const create: PolicyRolesDiff['create'] = [];
    const update: PolicyRolesDiff['update'] = [];
    const remove: PolicyRolesDiff['delete'] = [];

    for (const access of accesses) {
      const role = access.role;
      if (!role) {
        // Role is null for public policy only. This should not be updated nor removed.
        continue;
      }
      const accessId = rolesAccessesIdsMap.get(role);
      if (accessId) {
        update.push({ ...access, id: accessId });
      } else {
        create.push(access);
      }
    }

    for (const [role, accessId] of rolesAccessesIdsMap.entries()) {
      if (!accesses.some((access) => access.role === role)) {
        remove.push(accessId);
      }
    }

    return { create, update, delete: remove };
  }

  protected async getRolesAccessesIdsMap(
    policyId: string,
  ): Promise<Map<string, number>> {
    const client = await this.migrationClient.get();
    // This should not return twice the same role
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
