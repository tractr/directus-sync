import { Inject, Service } from 'typedi';
import { MigrationClient } from '../migration-client';
import { LOGGER } from '../../constants';
import pino from 'pino';
import {
  getChildLogger,
  loadJsonFilesRecursivelyWithSchema,
} from '../../helpers';
import { ConfigService } from '../config';
import { SeedIdMapperClient } from './id-mapper-client';
import { Seed } from './interfaces';
import * as Fs from 'fs-extra';
import { SeedsFileSchema } from './schema';

const DIRECTUS_COLLECTIONS_PREFIX = 'directus_';
const ITEMS_PREFIX = 'items';

@Service()
export class SeedClient {
  protected readonly logger: pino.Logger;

  constructor(
    @Inject(LOGGER) protected readonly baseLogger: pino.Logger,
    protected readonly migrationClient: MigrationClient,
    protected readonly config: ConfigService,
  ) {
    this.logger = getChildLogger(baseLogger, 'seed-client');
  }

  async push() {
    const seeds = await this.loadSeeds();
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

  protected async loadSeeds(): Promise<Seed[]> {
    const { paths } = this.config.getSeedConfig();
    const seeds: Seed[] = [];

    for (const path of paths) {
      // Test if the path exists
      if (!Fs.pathExistsSync(path)) {
        this.logger.warn(`Seed path does not exist: ${path}`);
      }
      seeds.push(
        ...loadJsonFilesRecursivelyWithSchema(
          path,
          SeedsFileSchema,
          'Load seeds',
        ).flat(2),
      );
    }

    // Order seeds by meta.insert_order
    // Leave seeds with undefined insert_order at the end, in the order they were loaded
    // For seeds with insert_order, sort them by insert_order in ascending order
    const unsortableSeeds = seeds.filter(
      (seed) => seed.meta?.insert_order === undefined,
    );
    const sortableSeeds = seeds.filter(
      (seed) => seed.meta?.insert_order !== undefined,
    );
    sortableSeeds.sort((a, b) => {
      return a.meta!.insert_order! - b.meta!.insert_order!;
    });
    return [...sortableSeeds, ...unsortableSeeds];
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
