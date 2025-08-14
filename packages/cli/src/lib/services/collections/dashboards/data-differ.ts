import { DataDiffer } from '../base';
import { Service } from 'typedi';
import { DASHBOARDS_COLLECTION } from './constants';
import { DashboardsDataLoader } from './data-loader';
import { DashboardsDataClient } from './data-client';
import { DashboardsIdMapperClient } from './id-mapper-client';
import { LoggerService } from '../../logger';
import { DashboardsDataMapper } from './data-mapper';
import { DirectusDashboard } from './interfaces';

@Service()
export class DashboardsDataDiffer extends DataDiffer<DirectusDashboard> {
  constructor(
    loggerService: LoggerService,
    dataLoader: DashboardsDataLoader,
    dataClient: DashboardsDataClient,
    dataMapper: DashboardsDataMapper,
    idMapper: DashboardsIdMapperClient,
  ) {
    super(
      loggerService.getChild(DASHBOARDS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
