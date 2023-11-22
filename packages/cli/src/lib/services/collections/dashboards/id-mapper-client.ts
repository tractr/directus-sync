import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { DASHBOARDS_COLLECTION } from './constants';
import { ConfigService } from '../../config';

@Service()
export class DashboardsIdMapperClient extends IdMapperClient {
  constructor(config: ConfigService) {
    super(config, DASHBOARDS_COLLECTION);
  }
}
