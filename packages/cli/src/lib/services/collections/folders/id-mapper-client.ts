import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { FOLDERS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class FoldersIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, FOLDERS_COLLECTION);
  }
}
