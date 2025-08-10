import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { PRESETS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LoggerService } from '../../logger';

@Service()
export class PresetsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient, loggerService: LoggerService) {
    super(
      migrationClient,
      loggerService.getChild(PRESETS_COLLECTION),
      PRESETS_COLLECTION,
    );
  }
}
