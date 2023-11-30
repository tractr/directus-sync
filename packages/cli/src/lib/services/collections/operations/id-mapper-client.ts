import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { OPERATIONS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class OperationsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, OPERATIONS_COLLECTION);
  }
}
