import Container, { ContainerInstance, Inject, Service } from 'typedi';
import { LOGGER } from '../../../constants';
import { COLLECTION, META } from '../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { Seed } from '../interfaces';
import { SeedLoader } from './seed-loader';
import { SeedCollection, SeedDataMapper } from '../collections';

@Service({ global: true })
export class SeedClient {
  protected readonly logger: pino.Logger;

  constructor(
    @Inject(LOGGER) protected readonly baseLogger: pino.Logger,
    protected readonly seedLoader: SeedLoader,
  ) {
    this.logger = getChildLogger(baseLogger, 'seed-client');
  }

  /**
   * Denotes if seeds exist
   */
  async hasSeeds(): Promise<boolean> {
    const seeds = await this.seedLoader.loadFromFiles();
    return seeds.length > 0;
  }

  /**
   * Display diff for all seeds
   */
  async diff(): Promise<void> {
    const seeds = await this.seedLoader.loadFromFiles();
    if (!seeds.length) {
      this.logger.warn('No seeds found');
    }
    for (const seed of seeds) {
      await this.diffSeed(seed);
    }
  }

  /**
   * Display diff for a seed
   */
  protected async diffSeed(seed: Seed): Promise<void> {
    const container = await this.createContainer(seed);
    const seedCollection = container.get(SeedCollection);
    await seedCollection.diff(seed.data);
    container.reset();
  }

  /**
   * Push all seeds
   */
  async push(): Promise<boolean> {
    const seeds = await this.seedLoader.loadFromFiles();
    if (!seeds.length) {
      this.logger.warn('No seeds found');
      return false;
    }

    let retry = false;
    for (const seed of seeds) {
      retry = (await this.pushSeed(seed)) || retry;
    }

    return retry;
  }

  protected async pushSeed(seed: Seed): Promise<boolean> {
    const container = await this.createContainer(seed);
    const seedCollection = container.get(SeedCollection);
    const retry = await seedCollection.push(seed.data);
    container.reset();
    return retry;
  }

  async cleanUp(): Promise<void> {
    const seeds = await this.seedLoader.loadFromFiles();
    if (!seeds.length) {
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
