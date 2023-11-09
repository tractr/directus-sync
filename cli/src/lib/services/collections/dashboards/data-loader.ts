import { DataLoader } from '../base';
import { DirectusDashboard } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { DASHBOARDS_COLLECTION } from './constants';
import path from 'path';

@Service()
export class DashboardsDataLoader extends DataLoader<
  DirectusDashboard<object>
> {
  constructor(@Inject('directusDumpPath') dumpPath: string) {
    const filePath = path.join(dumpPath, `${DASHBOARDS_COLLECTION}.json`);
    super(filePath);
  }
}
