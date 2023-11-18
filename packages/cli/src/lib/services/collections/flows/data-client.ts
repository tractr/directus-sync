import {DataClient, Query, WithoutIdAndSyncId} from '../base';
import {createFlow, deleteFlow, readFlows, updateFlow,} from '@directus/sdk';
import {Service} from 'typedi';
import {MigrationClient} from '../../migration-client';
import {DirectusFlow} from "./interfaces";

@Service()
export class FlowsDataClient extends DataClient<DirectusFlow> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteFlow(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusFlow>) {
    return createFlow(item);
  }

  protected getQueryCommand(query: Query<DirectusFlow>) {
    return readFlows(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusFlow>>,
  ) {
    return updateFlow(itemId, diffItem);
  }
}
