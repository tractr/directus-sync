import Container, { ContainerInstance, Inject, Service } from 'typedi';
import { COLLECTION, LOGGER, META } from '../../constants';
import pino from 'pino';
import { getChildLogger } from '../../helpers';
import { Seed } from './interfaces';
import { SeedLoader } from './seed-loader';
import { SeedCollection } from './collection';
import { SeedDataMapper } from './data-mapper';

@Service({ global: true })
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
      return;
    }

    let retry = false;

    for (const seed of seeds) {
      retry = (await this.pushItems(seed)) || retry;
    }

    return retry;
  }

  protected async pushItems(seed: Seed): Promise<boolean> {
    // Create a new container for this seed
    const container = await this.createContainer(seed);

    // Push the items
    const seedCollection = container.get(SeedCollection);
    const retry = await seedCollection.push(seed.data);

    // Reset the container
    container.reset();

    return retry;
  }

  async cleanUp(): Promise<void> {
    const seeds = await this.seedLoader.loadFromFiles();
    if (!seeds) {
      return;
    }

    for (const seed of seeds) {
      await this.cleanUpCollection(seed);
    }
  }

  protected async cleanUpCollection(seed: Seed): Promise<void> {
    const container = await this.createContainer(seed);

    const seedCollection = container.get(SeedCollection);
    await seedCollection.cleanUp();

    // Reset the container
    container.reset();
  }

  protected async createContainer(seed: Seed): Promise<ContainerInstance> {
    // Get the collection and meta
    const { collection, meta } = seed;

    // Create a new container for this seed
    const container = Container.of(collection);
    container.set(COLLECTION, collection);
    container.set(META, meta);
    container.set(LOGGER, Container.get(LOGGER));

    // Initialize the data mapper
    const dataMapper = container.get(SeedDataMapper);
    await dataMapper.initialize();

    return container;
  }
}
