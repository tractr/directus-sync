import { DirectusCollection } from '../base';
import { Service } from 'typedi';
import { DashboardsDataLoader } from './data-loader';
import { DashboardsDataClient } from './data-client';
import { DashboardsIdMapperClient } from './id-mapper-client';
import { DashboardsDataDiffer } from './data-differ';
import { LoggerService } from '../../logger';
import { DASHBOARDS_COLLECTION } from './constants';
import { DashboardsDataMapper } from './data-mapper';
import { DirectusDashboard } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class DashboardsCollection extends DirectusCollection<DirectusDashboard> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    loggerService: LoggerService,
    dataDiffer: DashboardsDataDiffer,
    dataLoader: DashboardsDataLoader,
    dataClient: DashboardsDataClient,
    dataMapper: DashboardsDataMapper,
    idMapper: DashboardsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      loggerService.getChild(DASHBOARDS_COLLECTION),
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
