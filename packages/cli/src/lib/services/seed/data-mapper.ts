import { Container } from 'typedi';
import { DataMapper } from '../collections/base';
import { LOGGER } from '../../constants';
import pino from 'pino';
import { getChildLogger } from '../../helpers';
import { DirectusUnknownType } from '../collections/base/interfaces';
import { SnapshotClient } from '../snapshot/snapshot-client';
import { SeedIdMapperClient } from './id-mapper-client';
import { SeedMeta } from './interfaces';

export class SeedDataMapper extends DataMapper<DirectusUnknownType> {
  /**
   * Indicates if the data mapper has been initialized
   */
  protected initialized = false;

  /**
   * Snapshot client
   */
  protected snapshotClient: SnapshotClient;

  constructor(
    protected readonly collection: string,
    protected readonly meta: SeedMeta | undefined,
  ) {
    const baseLogger = Container.get<pino.Logger>(LOGGER);
    const logger = getChildLogger(baseLogger, `Seed:${collection}`);
    super(logger);
    this.snapshotClient = Container.get(SnapshotClient);
  }

  /**
   * Initialize the id mappers by getting the relation fields from the snapshot
   * and creating a new SeedIdMapperClient for each relation
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const relationFields = await this.snapshotClient.getRelationFields(
      this.collection,
    );

    for (const field of relationFields) {
      const targetModel = await this.snapshotClient.getTargetModel(
        this.collection,
        field,
      );

      this.idMappers[field] = SeedIdMapperClient.forCollection(targetModel);
    }

    this.initialized = true;
  }
}
