import {DataDiffer} from '../base';
import {Inject, Service} from 'typedi';
import {DASHBOARDS_COLLECTION} from './constants';
import pino from 'pino';
import {DashboardsDataLoader} from './data-loader';
import {DashboardsDataClient} from './data-client';
import {DashboardsIdMapperClient} from './id-mapper-client';
import {getChildLogger} from '../../../helpers';
import {DashboardsDataMapper} from './data-mapper';
import {LOGGER} from '../../../constants';
import {DirectusDashboard} from "./interfaces";

@Service()
export class DashboardsDataDiffer extends DataDiffer<
  DirectusDashboard
> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
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
