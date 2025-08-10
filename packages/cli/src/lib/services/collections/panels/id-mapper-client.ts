import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LoggerService } from '../../logger';

@Service()
export class PanelsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient, loggerService: LoggerService) {
    super(
      migrationClient,
      loggerService.getChild(PANELS_COLLECTION),
      PANELS_COLLECTION,
    );
  }
}
