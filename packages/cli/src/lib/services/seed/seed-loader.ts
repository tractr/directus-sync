import { Inject, Service } from 'typedi';
import { LOGGER } from '../../constants';
import pino from 'pino';
import {
  getChildLogger,
  loadJsonFilesRecursivelyWithSchema,
} from '../../helpers';
import { ConfigService } from '../config';
import { Seed } from './interfaces';
import * as Fs from 'fs-extra';
import { SeedsFileSchema } from './schema';
import { Cacheable } from 'typescript-cacheable';

@Service({ global: true })
export class SeedLoader {
  protected readonly logger: pino.Logger;

  constructor(
    @Inject(LOGGER) protected readonly baseLogger: pino.Logger,
    protected readonly config: ConfigService,
  ) {
    this.logger = getChildLogger(baseLogger, 'seed-loader');
  }

  @Cacheable()
  async loadFromFiles(): Promise<Seed[]> {
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
}
