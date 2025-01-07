import { IdMapperClient } from '../collections';
import { MigrationClient } from '../migration-client';
import pino from 'pino';
import Container from 'typedi';
import { LOGGER } from '../../constants';
import { getChildLogger } from '../../helpers';
import { Cacheable } from 'typescript-cacheable';

const DIRECTUS_COLLECTIONS_PREFIX = 'directus_';
const CUSTOM_COLLECTIONS_PREFIX = 'items:';

export class SeedIdMapperClient extends IdMapperClient {
  protected constructor(collection: string) {
    // Get migration client
    const migrationClient = Container.get(MigrationClient);
    // Get base logger
    const baseLogger = Container.get<pino.Logger>(LOGGER);

    // Get the stored table name
    const storedTableName = collection.startsWith(DIRECTUS_COLLECTIONS_PREFIX)
      ? collection.slice(DIRECTUS_COLLECTIONS_PREFIX.length)
      : `${CUSTOM_COLLECTIONS_PREFIX}:${collection}`;

    super(
      migrationClient,
      getChildLogger(baseLogger, collection),
      storedTableName,
    );
  }

  /**
   * Get or create a SeedIdMapperClient instance for a specific collection
   */
  @Cacheable()
  static forCollection(collection: string) {
    return new SeedIdMapperClient(collection);
  }
}
