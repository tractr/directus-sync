import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { OPERATIONS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LoggerService } from '../../logger';

@Service()
export class OperationsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient, loggerService: LoggerService) {
    super(
      migrationClient,
      loggerService.getChild(OPERATIONS_COLLECTION),
      OPERATIONS_COLLECTION,
    );
  }
}
