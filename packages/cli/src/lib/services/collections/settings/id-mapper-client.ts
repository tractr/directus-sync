import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class SettingsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, SETTINGS_COLLECTION);
  }
}
