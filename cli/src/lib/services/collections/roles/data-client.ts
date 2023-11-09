import { DataClient, WithoutIdAndSyncId } from '../base';
import {
  createRole,
  deleteRole,
  DirectusRole,
  Query,
  readRoles,
  updateRole,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';

@Service()
export class RolesDataClient extends DataClient<DirectusRole<object>> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteRole(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusRole<object>>) {
    return createRole(item);
  }

  protected getQueryCommand(query: Query<DirectusRole<object>, object>) {
    return readRoles(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusRole<object>>>,
  ) {
    return updateRole(itemId, diffItem);
  }
}
