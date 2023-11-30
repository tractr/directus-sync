import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { ROLES_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class RolesIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, ROLES_COLLECTION);
  }
}
