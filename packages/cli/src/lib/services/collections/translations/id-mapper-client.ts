import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { TRANSLATIONS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LoggerService } from '../../logger';

@Service()
export class TranslationsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient, loggerService: LoggerService) {
    super(
      migrationClient,
      loggerService.getChild(TRANSLATIONS_COLLECTION),
      TRANSLATIONS_COLLECTION,
    );
  }
}
