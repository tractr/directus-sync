import { IdMapperClient } from '../collections';
import { MigrationClient } from '../migration-client';
import { Cacheable } from 'typescript-cacheable';
import { pascal } from 'case';
import pino from 'pino';
import { Inject } from 'typedi';
import { LOGGER } from '../../constants';
import { getChildLogger } from '../../helpers';
import { SeedMeta } from './interfaces';

const DIRECTUS_COLLECTIONS_PREFIX = 'directus_';
const CUSTOM_COLLECTIONS_PREFIX = 'items:';

export class SeedIdMapperClient extends IdMapperClient {
  constructor(
    migrationClient: MigrationClient,
    @Inject(LOGGER) baseLogger: pino.Logger,
    collection: string,
    protected readonly meta: SeedMeta | undefined,
  ) {
    super(
      migrationClient,
      getChildLogger(baseLogger, `Items:${pascal(collection)}`),
      collection,
    );
  }

  @Cacheable()
  protected getStoredTableName() {
    if (this.table.startsWith(DIRECTUS_COLLECTIONS_PREFIX)) {
      return this.table.slice(DIRECTUS_COLLECTIONS_PREFIX.length);
    }
    return `${CUSTOM_COLLECTIONS_PREFIX}:${this.table}`;
  }
}
