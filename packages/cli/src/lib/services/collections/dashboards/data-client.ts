import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createDashboard,
  deleteDashboard,
  readDashboards,
  updateDashboard,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusDashboard } from './interfaces';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { DASHBOARDS_COLLECTION } from './constants';

@Service()
export class DashboardsDataClient extends DataClient<DirectusDashboard> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, DASHBOARDS_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteDashboard(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusDashboard>) {
    return createDashboard(item);
  }

  protected getQueryCommand(query: Query<DirectusDashboard>) {
    return readDashboards(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusDashboard>>,
  ) {
    return updateDashboard(itemId, diffItem);
  }
}
