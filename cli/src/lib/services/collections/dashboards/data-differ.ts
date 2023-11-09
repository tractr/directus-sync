import { DataDiffer } from '../base';
import { DirectusDashboard } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { DASHBOARDS_COLLECTION } from './constants';
import pino from 'pino';
import { DashboardsDataLoader } from './data-loader';
import { DashboardsDataClient } from './data-client';
import { DashboardsIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { DashboardsDataMapper } from './data-mapper';

@Service()
export class DashboardsDataDiffer extends DataDiffer<
  DirectusDashboard<object>
> {
  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    dataLoader: DashboardsDataLoader,
    dataClient: DashboardsDataClient,
    dataMapper: DashboardsDataMapper,
    idMapper: DashboardsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, DASHBOARDS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
