import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { POLICIES_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class PoliciesIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, POLICIES_COLLECTION);
  }
}
