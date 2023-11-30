import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { PERMISSIONS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class PermissionsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, PERMISSIONS_COLLECTION);
  }
}
