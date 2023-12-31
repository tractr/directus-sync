import { DataDiffer } from '../base';
import { Inject, Service } from 'typedi';
import { FLOWS_COLLECTION } from './constants';
import pino from 'pino';
import { FlowsDataLoader } from './data-loader';
import { FlowsDataClient } from './data-client';
import { FlowsIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { FlowsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusFlow } from './interfaces';

@Service()
export class FlowsDataDiffer extends DataDiffer<DirectusFlow> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataLoader: FlowsDataLoader,
    dataClient: FlowsDataClient,
    dataMapper: FlowsDataMapper,
    idMapper: FlowsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, FLOWS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
