import { DataLoader } from '../base';
import { Service } from 'typedi';
import { DASHBOARDS_COLLECTION } from './constants';
import path from 'path';
import { DirectusDashboard } from './interfaces';
import { ConfigService } from '../../config';

@Service()
export class DashboardsDataLoader extends DataLoader<DirectusDashboard> {
  constructor(config: ConfigService) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${DASHBOARDS_COLLECTION}.json`,
    );
    const transformDataHooks = config.getHooksConfig(DASHBOARDS_COLLECTION);
    super(filePath, transformDataHooks);
  }
}
