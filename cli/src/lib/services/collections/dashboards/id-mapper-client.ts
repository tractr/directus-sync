import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { DASHBOARDS_COLLECTION } from './constants';

@Service()
export class DashboardsIdMapperClient extends IdMapperClient {
  constructor() {
    super(DASHBOARDS_COLLECTION);
  }
}
