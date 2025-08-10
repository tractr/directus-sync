import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import { createRole, deleteRole, readRoles, updateRole } from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusRole } from './interfaces';
import { LoggerService } from '../../logger';
import { ROLES_COLLECTION } from './constants';

@Service()
export class RolesDataClient extends DataClient<DirectusRole> {
  constructor(loggerService: LoggerService, migrationClient: MigrationClient) {
    super(loggerService.getChild(ROLES_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteRole(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusRole>) {
    return createRole(item);
  }

  protected getQueryCommand(query: Query<DirectusRole>) {
    return readRoles(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusRole>>,
  ) {
    return updateRole(itemId, diffItem);
  }
}
