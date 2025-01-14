import { Inject, Service } from 'typedi';
import { DataMapper } from '../collections';
import { COLLECTION, LOGGER, META } from '../../constants';
import pino from 'pino';
import { getChildLogger } from '../../helpers';
import { DirectusUnknownType } from '../interfaces';
import { SnapshotClient } from '../snapshot';
import { SeedIdMapperClientFactory } from './id-mapper-client';
import { SeedMeta } from './interfaces';

@Service()
export class SeedDataMapper extends DataMapper<DirectusUnknownType> {
  /**
   * Indicates if the data mapper has been initialized
   */
  protected initialized = false;

  constructor(
    @Inject(LOGGER) protected readonly baseLogger: pino.Logger,
    @Inject(COLLECTION) protected readonly collection: string,
    @Inject(META) protected readonly meta: SeedMeta | undefined,
    protected readonly snapshotClient: SnapshotClient,
    protected readonly idMapperClientFactory: SeedIdMapperClientFactory,
  ) {
    const logger = getChildLogger(baseLogger, collection);
    super(logger);
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

      this.idMappers[field] =
        this.idMapperClientFactory.forCollection(targetModel);
    }

    this.initialized = true;
  }
}
