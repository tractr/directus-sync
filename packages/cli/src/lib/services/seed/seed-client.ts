import { Inject, Service } from 'typedi';
import { MigrationClient } from '../migration-client';
import { Cacheable } from 'typescript-cacheable';
import { LOGGER } from '../../constants';
import pino from 'pino';
import { getChildLogger } from '../../helpers';
import { SEED } from './constants';
import { CollectionItemSeed, ConfigService } from '../config';
import { SeedIdMapperClient } from './id-mapper-client';

const DIRECTUS_COLLECTIONS_PREFIX = 'directus_';
const ITEMS_PREFIX = 'items';

@Service()
export class SeedClient {
  protected readonly logger: pino.Logger;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    protected readonly migrationClient: MigrationClient,
    protected readonly config: ConfigService,
  ) {
    this.logger = getChildLogger(baseLogger, SEED);
  }

  async push() {
    const seed = await this.getSeed();
    if (!seed) {
      this.logger.warn('Seed config is not defined');
      return;
    }

    for (const [collection, items] of Object.entries(seed)) {
      for (const item of items) {
        await this.pushItem(collection, item);
      }
    }
  }

  protected async pushItem(collection: string, item: CollectionItemSeed) {
    const idMapper = this.getIdMapper(collection);
    //....
  }

  protected async getSeed() {
    const { seed: rawSeed } = this.config.getSeedConfig();

    const seed =
      typeof rawSeed === 'function'
        ? await rawSeed(await this.migrationClient.get())
        : rawSeed;

    if (!seed || Object.keys(seed).length === 0) {
      return undefined;
    }

    return seed;
  }

  @Cacheable()
  protected getIdMapper(collection: string) {
    return new SeedIdMapperClient(
      this.migrationClient,
      this.getNormalizedCollection(collection),
    );
  }

  protected getNormalizedCollection(collection: string) {
    if (collection.startsWith(DIRECTUS_COLLECTIONS_PREFIX)) {
      return collection.slice(DIRECTUS_COLLECTIONS_PREFIX.length);
    }
    return `${ITEMS_PREFIX}:${collection}`;
  }
}
