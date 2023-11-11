import { DataLoader } from '../base';
import { DirectusDashboard } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { DASHBOARDS_COLLECTION } from './constants';
import path from 'path';
import type {CollectionsConfig} from "../../../config";
import {COLLECTIONS_CONFIG} from "../../../config";

@Service()
export class DashboardsDataLoader extends DataLoader<
  DirectusDashboard<object>
> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(config.dumpPath, `${DASHBOARDS_COLLECTION}.json`);
    super(filePath);
  }
}
