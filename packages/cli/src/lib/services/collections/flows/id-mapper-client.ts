import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { FLOWS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LoggerService } from '../../logger';

@Service()
export class FlowsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient, loggerService: LoggerService) {
    super(
      migrationClient,
      loggerService.getChild(FLOWS_COLLECTION),
      FLOWS_COLLECTION,
    );
  }
}
