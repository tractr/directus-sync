import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { FLOWS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class FlowsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, FLOWS_COLLECTION);
  }
}
