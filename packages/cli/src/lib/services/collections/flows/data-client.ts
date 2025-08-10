import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import { createFlow, deleteFlow, readFlows, updateFlow } from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusFlow } from './interfaces';
import { LoggerService } from '../../logger';
import { FLOWS_COLLECTION } from './constants';

@Service()
export class FlowsDataClient extends DataClient<DirectusFlow> {
  constructor(loggerService: LoggerService, migrationClient: MigrationClient) {
    super(loggerService.getChild(FLOWS_COLLECTION), migrationClient);
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
