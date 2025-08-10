import { DataDiffer } from '../base';
import { Service } from 'typedi';
import { OPERATIONS_COLLECTION } from './constants';
import { OperationsDataLoader } from './data-loader';
import { OperationsDataClient } from './data-client';
import { OperationsIdMapperClient } from './id-mapper-client';
import { LoggerService } from '../../logger';
import { OperationsDataMapper } from './data-mapper';
import { DirectusOperation } from './interfaces';

@Service()
export class OperationsDataDiffer extends DataDiffer<DirectusOperation> {
  constructor(
    loggerService: LoggerService,
    dataLoader: OperationsDataLoader,
    dataClient: OperationsDataClient,
    dataMapper: OperationsDataMapper,
    idMapper: OperationsIdMapperClient,
  ) {
    super(
      loggerService.getChild(OPERATIONS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
