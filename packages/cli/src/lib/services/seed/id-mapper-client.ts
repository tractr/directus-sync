import { IdMapperClient } from '../collections';
import { MigrationClient } from '../migration-client';
import { Cacheable } from 'typescript-cacheable';

const DIRECTUS_COLLECTIONS_PREFIX = 'directus_';
const CUSTOM_COLLECTIONS_PREFIX = 'cus:';

export class al extends IdMapperClient {
  constructor(migrationClient: MigrationClient, collection: string) {
    super(migrationClient, collection);
  }

  @Cacheable()
  protected getStoredTableName() {
    if (this.table.startsWith(DIRECTUS_COLLECTIONS_PREFIX)) {
      return this.table.slice(DIRECTUS_COLLECTIONS_PREFIX.length);
    }
    return `${CUSTOM_COLLECTIONS_PREFIX}:${this.table}`;
  }
}
