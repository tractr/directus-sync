import { Inject, Service } from 'typedi';
import { MigrationClient } from '../migration-client';
import { schemaApply, schemaDiff, schemaSnapshot } from '@directus/sdk';
import path from 'path';
import {
  Collection,
  Field,
  RawSchemaDiffOutput,
  Relation,
  SchemaDiffOutput,
  Snapshot,
} from './interfaces';
import { mkdirpSync, readJsonSync, removeSync, writeJsonSync } from 'fs-extra';
import { LOGGER } from '../../constants';
import pino from 'pino';
import { getChildLogger, loadJsonFilesRecursively } from '../../helpers';
import { ConfigService, SnapshotHooks } from '../config';
import { compareVersions } from 'compare-versions';

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

  protected readonly hooks: SnapshotHooks;

  protected snapshot: Snapshot | undefined;

  constructor(
    config: ConfigService,
    @Inject(LOGGER) baseLogger: pino.Logger,
    protected readonly migrationClient: MigrationClient,
  ) {
    this.logger = getChildLogger(baseLogger, 'snapshot');
    const { dumpPath, splitFiles, force } = config.getSnapshotConfig();
    this.dumpPath = dumpPath;
    this.splitFiles = splitFiles;
    this.force = force;
    this.hooks = config.getSnapshotHooksConfig();
  }

  /**
   * Save the snapshot locally
   */
  async pull() {
    const snapshot = await this.getSnapshot();
    const { onSave } = this.hooks;
    const transformedSnapshot = onSave
      ? await onSave(snapshot, await this.migrationClient.get())
      : snapshot;
    const numberOfFiles = this.saveData(transformedSnapshot);
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
    if (!diff) {
      this.logger.error('Could not get the diff from the Directus instance');
    } else if (!diff.diff) {
      this.logger.info('No changes to apply');
    } else {
      const directus = await this.migrationClient.get();
      await directus.request(schemaApply(diff as RawSchemaDiffOutput));
      this.logger.info('Changes applied');
    }
  }

  /**
   * Diff the snapshot from the dump file.
   */
  async diff() {
    const diff = await this.diffSnapshot();
    if (!diff) {
      this.logger.error('Could not get the diff from the Directus instance');
    } else if (!diff.diff) {
      this.logger.info('No changes to apply');
    } else {
      const { collections, fields, relations } = diff.diff;
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
   * Get the snapshot from cache or from the Directus instance.
   * This ensures to get the snapshot only once.
   * If forceRefresh is true, the snapshot is fetched from the Directus instance.
   * @protected
   */
  protected async getSnapshot(forceRefresh = false): Promise<Snapshot> {
    if (!this.snapshot || forceRefresh) {
      const directus = await this.migrationClient.get();
      this.snapshot = await directus.request<Snapshot>(schemaSnapshot()); // Get better types
    }
    return this.snapshot;
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
  protected decomposeData(
    data: Snapshot,
  ): { path: string; content: unknown }[] {
    const { collections, fields, relations, ...info } = data;

    const files: { path: string; content: unknown }[] = [
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
  protected async diffSnapshot(): Promise<SchemaDiffOutput | undefined> {
    const directus = await this.migrationClient.get();
    const { onLoad } = this.hooks;
    const snapshot = this.loadData();
    const transformedSnapshot = onLoad
      ? await onLoad(snapshot, await this.migrationClient.get())
      : snapshot;
    return (await directus.request(
      schemaDiff(transformedSnapshot, this.force),
    )) as SchemaDiffOutput | undefined;
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

  /**
   * Get the server version
   */
  async getDirectusVersion() {
    const snapshot = await this.getSnapshot();
    return snapshot.directus;
  }

  /**
   * This method compares the Directus instance version with the given one.
   */
  async compareWithDirectusVersion(
    version: string,
  ): Promise<'equal' | 'greater' | 'smaller'> {
    const directusVersion = await this.getDirectusVersion();
    const diff = compareVersions(version, directusVersion);
    if (diff === 0) {
      return 'equal';
    } else if (diff > 0) {
      return 'greater';
    } else {
      return 'smaller';
    }
  }
}
