import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { PERMISSIONS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LoggerService } from '../../logger';

@Service()
export class PermissionsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient, loggerService: LoggerService) {
    super(
      migrationClient,
      loggerService.getChild(PERMISSIONS_COLLECTION),
      PERMISSIONS_COLLECTION,
    );
  }
}
