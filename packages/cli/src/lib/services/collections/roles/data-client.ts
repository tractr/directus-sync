import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import { createRole, deleteRole, readRoles, updateRole } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
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
    return readRoles(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusRole>>,
  ) {
    return updateRole(itemId, diffItem);
  }
}
