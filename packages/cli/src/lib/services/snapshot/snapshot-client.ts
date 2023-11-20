import { Inject, Service } from 'typedi';
import { MigrationClient } from '../migration-client';
import { schemaApply, schemaDiff, schemaSnapshot } from '@directus/sdk';
import path from 'path';
import type { SnapshotConfig } from '../../config';
import { Collection, Field, Relation, Snapshot } from './interfaces';
import { mkdirpSync, readJsonSync, removeSync, writeJsonSync } from 'fs-extra';
import { LOGGER, SNAPSHOT_CONFIG } from '../../constants';
import pino from 'pino';
import { getChildLogger, loadJsonFilesRecursively } from '../../helpers';

interface SnapshotDiffDiff { collections: unknown[], fields: unknown[], relations: unknown[] }

const SNAPSHOT_JSON = 'snapshot.json';
const INFO_JSON = 'info.json';
const COLLECTIONS_DIR = 'collections';
const FIELDS_DIR = 'fields';
const RELATIONS_DIR = 'relations';


@Service()
export class SnapshotClient {
  protected readonly dumpPath: string;

  protected readonly splitFiles: boolean;

  protected readonly force: boolean;

  protected readonly logger: pino.Logger;

  constructor(
    @Inject(SNAPSHOT_CONFIG) config: SnapshotConfig,
    @Inject(LOGGER) baseLogger: pino.Logger,
    protected readonly migrationClient: MigrationClient,
  ) {
    this.logger = getChildLogger(baseLogger, 'snapshot');
    this.dumpPath = config.dumpPath;
    this.splitFiles = config.splitFiles;
    this.force = config.force;
  }

  /**
   * Save the snapshot locally
   */
  async pull() {
    const snapshot = await this.getSnapshot();
    const numberOfFiles = this.saveData(snapshot);
    this.logger.debug(
      `Saved ${numberOfFiles} file${numberOfFiles > 1 ? 's' : ''} to ${
        this.dumpPath
      }`,
    );
  }

  /**
   * Apply the snapshot from the dump files.
   */
  async push() {
    const diff = await this.diffSnapshot();
    if (!diff?.diff) {
      this.logger.info('No changes to apply');
    } else {
      const directus = this.migrationClient.get();
      await directus.request(schemaApply(diff));
      this.logger.info('Changes applied');
    }
  }

  /**
   * Diff the snapshot from the dump file.
   */
  async diff() {
    const diff = await this.diffSnapshot();
    if (!diff?.diff) {
      this.logger.info('No changes to apply');
    } else {
      const { collections, fields, relations } = diff.diff as SnapshotDiffDiff;
      if (collections) {
        this.logger.info(
          `Found ${collections.length} change${
            collections.length > 1 ? 's' : ''
          } in collections`,
        );
      } else {
        this.logger.info('No changes in collections');
      }
      if (fields) {
        this.logger.info(
          `Found ${fields.length} change${
            fields.length > 1 ? 's' : ''
          } in fields`,
        );
      } else {
        this.logger.info('No changes in fields');
      }
      if (relations) {
        this.logger.info(
          `Found ${relations.length} change${
            relations.length > 1 ? 's' : ''
          } in relations`,
        );
      } else {
        this.logger.info('No changes in relations');
      }
      this.logger.debug(diff, 'Diff');
    }
  }

  /**
   * Get the snapshot from the Directus instance.
   */
  protected async getSnapshot() {
    const directus = this.migrationClient.get();
    return await directus.request<Snapshot>(schemaSnapshot()); // Get better types
  }

  /**
   * Save the data to the dump file. The data is passed through the data transformer.
   * Returns the number of saved items.
   */
  protected saveData(data: Snapshot): number {
    // Clean directory
    removeSync(this.dumpPath);
    mkdirpSync(this.dumpPath);
    // Save data
    if (this.splitFiles) {
      const files = this.decomposeData(data);
      for (const file of files) {
        const filePath = path.join(this.dumpPath, file.path);
        const dirPath = path.dirname(filePath);
        mkdirpSync(dirPath);
        writeJsonSync(filePath, file.content, { spaces: 2 });
      }
      return files.length;
    } else {
      const filePath = path.join(this.dumpPath, SNAPSHOT_JSON);
      writeJsonSync(filePath, data, { spaces: 2 });
      return 1;
    }
  }

  /**
   * Decompose the snapshot into a collection of files.
   */
  protected decomposeData(data: Snapshot): { path: string; content: any }[] {
    const { collections, fields, relations, ...info } = data;

    const files: { path: string; content: any }[] = [
      { path: INFO_JSON, content: info },
    ];

    // Split collections
    for (const collection of collections) {
      files.push({
        path: `${COLLECTIONS_DIR}/${collection.collection}.json`,
        content: collection,
      });
    }
    // Split fields
    for (const field of fields) {
      files.push({
        path: `${FIELDS_DIR}/${field.collection}/${field.field}.json`,
        content: field,
      });
    }
    // Split relations
    for (const relation of relations) {
      files.push({
        path: `${RELATIONS_DIR}/${relation.collection}/${relation.field}.json`,
        content: relation,
      });
    }

    return files;
  }

  /**
   * Get the diff from Directus instance
   */
  protected async diffSnapshot() {
    const directus = this.migrationClient.get();
    const snapshot = this.loadData();
    return await directus.request(schemaDiff(snapshot, this.force));
  }

  /**
   * Load the snapshot from the dump file or the decomposed files.
   */
  protected loadData(): Snapshot {
    if (this.splitFiles) {
      const collections = loadJsonFilesRecursively<Collection>(
        path.join(this.dumpPath, COLLECTIONS_DIR),
      );
      const fields = loadJsonFilesRecursively<Field>(
        path.join(this.dumpPath, FIELDS_DIR),
      );
      const relations = loadJsonFilesRecursively<Relation>(
        path.join(this.dumpPath, RELATIONS_DIR),
      );
      const info = readJsonSync(path.join(this.dumpPath, INFO_JSON)) as Omit<
        Snapshot,
        'collections' | 'fields' | 'relations'
      >;
      return { ...info, collections, fields, relations };
    } else {
      const filePath = path.join(this.dumpPath, SNAPSHOT_JSON);
      return readJsonSync(filePath, 'utf-8') as Snapshot;
    }
  }
}
