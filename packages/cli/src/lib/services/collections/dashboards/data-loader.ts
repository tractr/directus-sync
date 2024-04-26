import { DataLoader } from '../base';
import { Service } from 'typedi';
import { DASHBOARDS_COLLECTION } from './constants';
import path from 'path';
import { DirectusDashboard } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class DashboardsDataLoader extends DataLoader<DirectusDashboard> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${DASHBOARDS_COLLECTION}.json`,
    );
    const hooks = config.getCollectionHooksConfig(DASHBOARDS_COLLECTION);
    super(filePath, migrationClient, hooks);
  }
}
