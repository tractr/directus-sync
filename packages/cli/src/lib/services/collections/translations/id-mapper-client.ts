import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { TRANSLATIONS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class TranslationsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, TRANSLATIONS_COLLECTION);
  }
}
