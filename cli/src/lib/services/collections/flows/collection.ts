import 'dotenv/config';
import { DirectusFlow } from '@directus/sdk';
import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { FlowsDataLoader } from './data-loader';
import { FlowsDataClient } from './data-client';
import { FlowsIdMapperClient } from './id-mapper-client';
import { FlowsDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { FLOWS_COLLECTION } from './constants';
import { FlowsDataMapper } from './data-mapper';

@Service()
export class FlowsCollection extends DirectusCollection<DirectusFlow<object>> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    dataDiffer: FlowsDataDiffer,
    dataLoader: FlowsDataLoader,
    dataClient: FlowsDataClient,
    dataMapper: FlowsDataMapper,
    idMapper: FlowsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, FLOWS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
