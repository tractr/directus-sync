import { DataClient, WithoutIdAndSyncId } from '../base';
import {
  createFlow,
  deleteFlow,
  DirectusFlow,
  Query,
  readFlows,
  updateFlow,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';

@Service()
export class FlowsDataClient extends DataClient<DirectusFlow<object>> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteFlow(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusFlow<object>>) {
    return createFlow(item);
  }

  protected getQueryCommand(query: Query<DirectusFlow<object>, object>) {
    return readFlows(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusFlow<object>>>,
  ) {
    return updateFlow(itemId, diffItem);
  }
}
