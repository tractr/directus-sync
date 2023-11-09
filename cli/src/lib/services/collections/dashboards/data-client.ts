import { DataClient, WithoutIdAndSyncId } from '../base';
import {
  createDashboard,
  deleteDashboard,
  DirectusDashboard,
  Query,
  readDashboards,
  updateDashboard,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';

@Service()
export class DashboardsDataClient extends DataClient<
  DirectusDashboard<object>
> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteDashboard(itemId);
  }

  protected getInsertCommand(
    item: WithoutIdAndSyncId<DirectusDashboard<object>>,
  ) {
    return createDashboard(item);
  }

  protected getQueryCommand(query: Query<DirectusDashboard<object>, object>) {
    return readDashboards(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusDashboard<object>>>,
  ) {
    return updateDashboard(itemId, diffItem);
  }
}
