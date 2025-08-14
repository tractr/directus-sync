import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { FOLDERS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LoggerService } from '../../logger';

@Service()
export class FoldersIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient, loggerService: LoggerService) {
    super(
      migrationClient,
      loggerService.getChild(FOLDERS_COLLECTION),
      FOLDERS_COLLECTION,
    );
  }
}
