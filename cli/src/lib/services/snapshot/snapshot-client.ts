import { Inject, Service } from 'typedi';
import { MigrationClient } from '../migration-client';
import { schemaSnapshot } from '@directus/sdk';
import path from 'path';
import type { SnapshotConfig } from '../../config';
import { Collection, Field, Relation, Snapshot } from './interfaces';
import {
  mkdirpSync,
  readdirSync,
  readJsonSync,
  removeSync,
  statSync,
  writeJsonSync,
} from 'fs-extra';
import { LOGGER, SNAPSHOT_CONFIG } from '../../constants';
import pino from 'pino';
import { getChildLogger } from '../../helpers';

const SNAPSHOT_JSON = 'snapshot.json';
const INFO_JSON = 'info.json';
const COLLECTIONS_DIR = 'collections';
const FIELDS_DIR = 'fields';
const RELATIONS_DIR = 'relations';

@Service()
export class SnapshotClient {
  protected readonly dumpPath: string;

  protected readonly splitFiles: boolean;

  protected readonly logger: pino.Logger;

  constructor(
    @Inject(SNAPSHOT_CONFIG) config: SnapshotConfig,
    @Inject(LOGGER) baseLogger: pino.Logger,
    protected readonly migrationClient: MigrationClient,
  ) {
    this.logger = getChildLogger(baseLogger, 'snapshot');
    this.dumpPath = config.dumpPath;
    this.splitFiles = config.splitFiles;
  }

  /**
   * Save the snapshot to the dump file.
   */
  async saveSnapshot() {
    const snapshot = await this.getSnapshot();
    const numberOfFiles = this.saveData(snapshot);
    this.logger.info(
      `Saved ${numberOfFiles} file${numberOfFiles > 1 ? 's' : ''} to ${
        this.dumpPath
      }`,
    );
  }

  /**
   * Get the snapshot from the Directus instance.
   */
  protected async getSnapshot() {
    const directus = await this.migrationClient.getClient();
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
   * Restore the snapshot from the dump file.
   */
  async restoreSnapshot() {
    const snapshot = this.loadData();
    console.log(snapshot);
    // await this.restoreData(snapshot);
  }

  /**
   * Load the snapshot from the dump file of the decomposed files.
   */
  protected loadData(): Snapshot {
    if (this.splitFiles) {
      const collections = this.loadJsonFilesRecursively<Collection>(
        path.join(this.dumpPath, COLLECTIONS_DIR),
      );
      const fields = this.loadJsonFilesRecursively<Field>(
        path.join(this.dumpPath, FIELDS_DIR),
      );
      const relations = this.loadJsonFilesRecursively<Relation>(
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

  /**
   * This methods recursively loads the files from a directory.
   */
  protected loadJsonFilesRecursively<T>(dirPath: string): T[] {
    const files: T[] = [];
    const fileNames = readdirSync(dirPath);
    for (const fileName of fileNames) {
      const filePath = path.join(dirPath, fileName);
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        files.push(...this.loadJsonFilesRecursively<T>(filePath));
      } else if (fileName.endsWith('.json')) {
        files.push(readJsonSync(filePath, 'utf-8') as T);
      }
    }
    return files;
  }
}
