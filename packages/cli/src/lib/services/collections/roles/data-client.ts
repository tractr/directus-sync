import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import { createRole, deleteRole, readRoles, updateRole } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import deepmerge from 'deepmerge';
import { DirectusRole } from './interfaces';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { ROLES_COLLECTION } from './constants';

@Service()
export class RolesDataClient extends DataClient<DirectusRole> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, ROLES_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteRole(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusRole>) {
    return createRole(item);
  }

  protected async getQueryCommand(query: Query<DirectusRole>) {
    // Always exclude the admin role from the dump
    const adminRoleId = await this.migrationClient.getAdminRoleId();
    // Do not filter by id if the query already contains a filter for the id
    const hasIdFilter = query.filter && (query.filter as { id?: string }).id;
    const newQuery = !hasIdFilter
      ? deepmerge(query, {
          filter: {
            id: {
              _neq: adminRoleId,
            },
          },
        })
      : query;
    return readRoles(newQuery);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusRole>>,
  ) {
    return updateRole(itemId, diffItem);
  }
}
