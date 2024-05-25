import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { DashboardsDataLoader } from './data-loader';
import { DashboardsDataClient } from './data-client';
import { DashboardsIdMapperClient } from './id-mapper-client';
import { DashboardsDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { DASHBOARDS_COLLECTION } from './constants';
import { DashboardsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusDashboard } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class DashboardsCollection extends DirectusCollection<DirectusDashboard> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataDiffer: DashboardsDataDiffer,
    dataLoader: DashboardsDataLoader,
    dataClient: DashboardsDataClient,
    dataMapper: DashboardsDataMapper,
    idMapper: DashboardsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      getChildLogger(baseLogger, DASHBOARDS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(DASHBOARDS_COLLECTION),
        preserveIds: config.shouldPreserveIds(DASHBOARDS_COLLECTION),
      },
    );
  }
}
