import 'dotenv/config';
import { DirectusOperation } from '@directus/sdk';
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

@Service()
export class OperationsCollection extends DirectusCollection<
  DirectusOperation<object>
> {
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
  ) {
    super(
      getChildLogger(baseLogger, OPERATIONS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
