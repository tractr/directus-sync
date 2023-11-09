import { DataMapper } from '../base';
import { DirectusSettings } from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';

@Service()
export class SettingsDataMapper extends DataMapper<DirectusSettings<object>> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }
}
