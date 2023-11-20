import { DataLoader } from '../base';
import { Inject, Service } from 'typedi';
import { DASHBOARDS_COLLECTION } from './constants';
import path from 'path';
import type { CollectionsConfig } from '../../../config';
import { COLLECTIONS_CONFIG } from '../../../constants';
import { DirectusDashboard } from './interfaces';

@Service()
export class DashboardsDataLoader extends DataLoader<DirectusDashboard> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(
      config.dumpPath,
      `${DASHBOARDS_COLLECTION}.json`,
    );
    super(filePath);
  }
}
