import { Inject, Service } from 'typedi';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import {
  getChildLogger,
  loadJsonFilesRecursivelyWithSchema,
} from '../../../helpers';
import { ConfigService } from '../../config';
import { Seed, SeedsFileSchema } from '../interfaces';
import * as Fs from 'fs-extra';
import { Cacheable } from 'typescript-cacheable';
import {
  DirectusNativeStructure,
  SupportedDirectusCollections,
} from './directus-structure';

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
  loadFromFiles(): Seed[] {
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
      return a.meta.insert_order! - b.meta.insert_order!;
    });
    const sortedSeeds = [...sortableSeeds, ...unsortableSeeds];

    // Merge seeds with the same collection name
    const mergedSeeds = sortedSeeds.reduce((acc, seed) => {
      const existing = acc.find((s) => s.collection === seed.collection);
      if (existing) {
        this.mergeSeeds(existing, seed);
      } else {
        acc.push(seed);
      }
      return acc;
    }, [] as Seed[]);

    // Apply defaults for directus collections
    mergedSeeds.forEach((seed) => this.applyDirectusCollectionDefaults(seed));

    return mergedSeeds;
  }

  /**
   * Merge two seeds
   *  - merge data with concat
   *  - merge meta.create, meta.update, meta.delete with AND logic
   *  - merge meta.preserve_ids with OR logic
   */
  protected mergeSeeds(existing: Seed, seed: Seed): void {
    existing.data = [...existing.data, ...seed.data];
    existing.meta.create = existing.meta.create && seed.meta.create;
    existing.meta.update = existing.meta.update && seed.meta.update;
    existing.meta.delete = existing.meta.delete && seed.meta.delete;
    existing.meta.preserve_ids =
      existing.meta.preserve_ids || seed.meta.preserve_ids;
    existing.meta.ignore_on_update = [
      ...existing.meta.ignore_on_update,
      ...seed.meta.ignore_on_update,
    ];
  }

  /**
   * Applies the defaults for directus collections.
   *  - ignore_on_update: add the fields that are ignored on update in the Directus structure
   */
  protected applyDirectusCollectionDefaults(seed: Seed): void {
    if (this.isDirectusCollection(seed.collection)) {
      const structure = DirectusNativeStructure[seed.collection];
      seed.meta.ignore_on_update = [
        ...structure.ignoreOnUpdate,
        ...seed.meta.ignore_on_update,
      ];
    }
  }

  /**
   * Denotes if the collection is a directus collection.
   */
  protected isDirectusCollection(
    collection: string,
  ): collection is SupportedDirectusCollections {
    return SupportedDirectusCollections.includes(
      collection as SupportedDirectusCollections,
    );
  }
}
