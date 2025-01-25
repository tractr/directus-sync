import { IdMapperClient } from '../../collections';
import { MigrationClient } from '../../migration-client';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { LOGGER } from '../../../constants';
import { getChildLogger } from '../../../helpers';
import { Cacheable } from 'typescript-cacheable';
import {
  CUSTOM_COLLECTIONS_MAPPING_PREFIX,
  DIRECTUS_COLLECTIONS_PREFIX,
} from '../../../constants';

export class SeedIdMapperClient extends IdMapperClient {}

/**
 * Factory for SeedIdMapperClient instances
 * We use a global service to ensure that the same instance is used for the same collection
 */
@Service({ global: true })
export class SeedIdMapperClientFactory {
  constructor(
    private readonly migrationClient: MigrationClient,
    @Inject(LOGGER) private readonly baseLogger: pino.Logger,
  ) {}

  /**
   * Get or create a SeedIdMapperClient instance for a specific collection
   */
  @Cacheable()
  forCollection(collection: string) {
    // Get the stored table name
    const storedTableName = collection.startsWith(DIRECTUS_COLLECTIONS_PREFIX)
      ? collection.slice(DIRECTUS_COLLECTIONS_PREFIX.length)
      : `${CUSTOM_COLLECTIONS_MAPPING_PREFIX}:${collection}`;

    return new SeedIdMapperClient(
      this.migrationClient,
      getChildLogger(this.baseLogger, collection),
      storedTableName,
    );
  }
}
