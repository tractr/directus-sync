import { IdMapperClient } from '../collections';
import { MigrationClient } from '../migration-client';

export class SeedIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient, collection: string) {
    super(migrationClient, collection);
  }
}
