import 'dotenv/config';
import { DirectusFlow } from '@directus/sdk';
import { DirectusCollection, WithSyncIdAndWithoutId } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { FlowsDataLoader } from './data-loader';
import { FlowsDataClient } from './data-client';
import { FlowsIdMapperClient } from './id-mapper-client';
import { FlowsDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { FLOWS_COLLECTION } from './constants';
import { FlowsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';

@Service()
export class FlowsCollection extends DirectusCollection<DirectusFlow<object>> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
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

  /**
   * Override the methods in order to break dependency cycle between flows and operations
   * Always create new flows without reference to operations. Then update the flow once the operations are created.
   */
  protected async create(
    toCreate: WithSyncIdAndWithoutId<DirectusFlow<object>>[],
  ): Promise<boolean> {
    const shouldRetry = toCreate.length > 0;
    const toCreateWithoutOperations = toCreate.map((flow) => {
      return {
        ...flow,
        operation: null,
      };
    });
    await super.create(toCreateWithoutOperations);
    return shouldRetry;
  }
}
