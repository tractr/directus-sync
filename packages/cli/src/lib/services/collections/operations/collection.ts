import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { OperationsDataLoader } from './data-loader';
import { OperationsDataClient } from './data-client';
import { OperationsIdMapperClient } from './id-mapper-client';
import { OperationsDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { OPERATIONS_COLLECTION } from './constants';
import { OperationsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusOperation } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class OperationsCollection extends DirectusCollection<DirectusOperation> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataDiffer: OperationsDataDiffer,
    dataLoader: OperationsDataLoader,
    dataClient: OperationsDataClient,
    dataMapper: OperationsDataMapper,
    idMapper: OperationsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      getChildLogger(baseLogger, OPERATIONS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      config.getHooksConfig(OPERATIONS_COLLECTION),
    );
  }
}
