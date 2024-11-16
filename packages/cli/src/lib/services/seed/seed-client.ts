import {Inject, Service} from 'typedi';
import {MigrationClient} from '../migration-client';
import {LOGGER} from '../../constants';
import pino from 'pino';
import {getChildLogger,} from '../../helpers';
import {ConfigService} from '../config';
import {SeedIdMapperClient} from './id-mapper-client';
import {Seed} from './interfaces';
import {SeedLoader} from "./seed-loader";

const DIRECTUS_COLLECTIONS_PREFIX = 'directus_';
const ITEMS_PREFIX = 'items';

@Service()
export class SeedClient {
  protected readonly logger: pino.Logger;

  constructor(
    @Inject(LOGGER) protected readonly baseLogger: pino.Logger,
    protected readonly migrationClient: MigrationClient,
    protected readonly config: ConfigService,
    protected readonly seedLoader: SeedLoader,
  ) {
    this.logger = getChildLogger(baseLogger, 'seed-client');
  }

  async push() {
    const seeds = await this.seedLoader.loadFromFiles();
    if (!seeds) {
      this.logger.warn('No seeds found');
      return false;
    }

    for (const seed of seeds) {
      await this.pushItems(seed);
    }

    return false;
  }

  protected async pushItems(seed: Seed) {
    const idMapper = this.createIdMapper(seed);
    await idMapper.getAll();
  }

  async cleanUp() {
    // TODO: Implement
  }

  protected createIdMapper(seed: Seed) {
    return new SeedIdMapperClient(
      this.migrationClient,
      this.baseLogger,
      this.getNormalizedCollection(seed.collection),
      seed.meta,
    );
  }

  protected getNormalizedCollection(collection: string) {
    if (collection.startsWith(DIRECTUS_COLLECTIONS_PREFIX)) {
      return collection.slice(DIRECTUS_COLLECTIONS_PREFIX.length);
    }
    return `${ITEMS_PREFIX}:${collection}`;
  }
}
