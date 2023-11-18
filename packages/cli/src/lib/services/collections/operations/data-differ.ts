import { DataDiffer } from '../base';
import { DirectusOperation } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { OPERATIONS_COLLECTION } from './constants';
import pino from 'pino';
import { OperationsDataLoader } from './data-loader';
import { OperationsDataClient } from './data-client';
import { OperationsIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { OperationsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';

@Service()
export class OperationsDataDiffer extends DataDiffer<
  DirectusOperation<object>
> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataLoader: OperationsDataLoader,
    dataClient: OperationsDataClient,
    dataMapper: OperationsDataMapper,
    idMapper: OperationsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, OPERATIONS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
