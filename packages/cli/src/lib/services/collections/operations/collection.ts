import { DirectusCollection } from '../base';
import { Service } from 'typedi';
import { OperationsDataLoader } from './data-loader';
import { OperationsDataClient } from './data-client';
import { OperationsIdMapperClient } from './id-mapper-client';
import { OperationsDataDiffer } from './data-differ';
import { LoggerService } from '../../logger';
import { OPERATIONS_COLLECTION } from './constants';
import { OperationsDataMapper } from './data-mapper';
import { DirectusOperation } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class OperationsCollection extends DirectusCollection<DirectusOperation> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    loggerService: LoggerService,
    dataDiffer: OperationsDataDiffer,
    dataLoader: OperationsDataLoader,
    dataClient: OperationsDataClient,
    dataMapper: OperationsDataMapper,
    idMapper: OperationsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      loggerService.getChild(OPERATIONS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(OPERATIONS_COLLECTION),
        preserveIds: config.shouldPreserveIds(OPERATIONS_COLLECTION),
      },
    );
  }
}
