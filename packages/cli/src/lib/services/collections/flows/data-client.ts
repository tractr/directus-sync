import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import { createFlow, deleteFlow, readFlows, updateFlow } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusFlow } from './interfaces';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { FLOWS_COLLECTION } from './constants';

@Service()
export class FlowsDataClient extends DataClient<DirectusFlow> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,migrationClient: MigrationClient) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION), migrationClient);
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
