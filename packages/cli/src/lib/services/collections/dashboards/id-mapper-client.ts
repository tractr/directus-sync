import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { DASHBOARDS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class DashboardsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, DASHBOARDS_COLLECTION);
  }
}
