import Container, { Inject, Service } from 'typedi';
import { COLLECTION, LOGGER, META } from '../../constants';
import pino from 'pino';
import { getChildLogger } from '../../helpers';
import { Seed } from './interfaces';
import { SeedLoader } from './seed-loader';
import { SeedCollection } from './collection';
import { SeedDataMapper } from './data-mapper';

@Service()
export class SeedClient {
  protected readonly logger: pino.Logger;

  constructor(
    @Inject(LOGGER) protected readonly baseLogger: pino.Logger,
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

  protected async pushItems(seed: Seed): Promise<boolean> {
    // Get the collection and meta
    const { collection, meta, data } = seed;

    // Create a new container for this seed
    const container = Container.of(collection);
    container.set(COLLECTION, collection);
    container.set(META, meta);
    container.set(LOGGER, Container.get(LOGGER));

    const dataMapper = container.get(SeedDataMapper);
    const seedCollection = container.get(SeedCollection);

    // Initialize the data mapper
    await dataMapper.initialize();

    // Push the items
    const retry = await seedCollection.push(data);

    // Reset the container
    container.reset();

    return retry;
  }

  async cleanUp() {}
}
