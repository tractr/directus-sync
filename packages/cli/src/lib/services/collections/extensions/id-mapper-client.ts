import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { EXTENSIONS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class ExtensionsIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, EXTENSIONS_COLLECTION);
  }
}
