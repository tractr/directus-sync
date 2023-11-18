import {DataClient, Query, WithoutIdAndSyncId} from '../base';
import {createDashboard, deleteDashboard, readDashboards, updateDashboard,} from '@directus/sdk';
import {Service} from 'typedi';
import {MigrationClient} from '../../migration-client';
import {DirectusDashboard} from "./interfaces";

@Service()
export class DashboardsDataClient extends DataClient<
  DirectusDashboard
> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteDashboard(itemId);
  }

  protected getInsertCommand(
    item: WithoutIdAndSyncId<DirectusDashboard>,
  ) {
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
