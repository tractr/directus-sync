import { Inject, Service } from 'typedi';
import { MigrationClient } from '../migration-client';
import { LOGGER } from '../../constants';
import pino from 'pino';
import { getChildLogger } from '../../helpers';
import { ConfigService } from '../config';
import { SeedIdMapperClient } from './id-mapper-client';
import { Seed } from './interfaces';
import { SeedLoader } from './seed-loader';
import { SeedCollection } from './collection';
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
    const collection = seed.collection;
    const seedCollection = new SeedCollection(collection, seed.meta);
  }

  async cleanUp() {
    // TODO: Implement
  }

  protected createIdMapper(seed: Seed) {
    return SeedIdMapperClient.forCollection(seed.collection);
  }
}
