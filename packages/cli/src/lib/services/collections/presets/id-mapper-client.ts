import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { PRESETS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class PresetsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, PRESETS_COLLECTION);
  }
}
