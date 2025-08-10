import { DataDiffer } from '../base';
import { Service } from 'typedi';
import { FLOWS_COLLECTION } from './constants';
import { FlowsDataLoader } from './data-loader';
import { FlowsDataClient } from './data-client';
import { FlowsIdMapperClient } from './id-mapper-client';
import { LoggerService } from '../../logger';
import { FlowsDataMapper } from './data-mapper';
import { DirectusFlow } from './interfaces';

@Service()
export class FlowsDataDiffer extends DataDiffer<DirectusFlow> {
  constructor(
    loggerService: LoggerService,
    dataLoader: FlowsDataLoader,
    dataClient: FlowsDataClient,
    dataMapper: FlowsDataMapper,
    idMapper: FlowsIdMapperClient,
  ) {
    super(
      loggerService.getChild(FLOWS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
