import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class PanelsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, PANELS_COLLECTION);
  }
}
