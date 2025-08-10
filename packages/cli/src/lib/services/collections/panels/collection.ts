import { DirectusCollection } from '../base';
import { Service } from 'typedi';
import { PanelsDataLoader } from './data-loader';
import { PanelsDataClient } from './data-client';
import { PanelsIdMapperClient } from './id-mapper-client';
import { PanelsDataDiffer } from './data-differ';
import { LoggerService } from '../../logger';
import { PANELS_COLLECTION } from './constants';
import { PanelsDataMapper } from './data-mapper';
import { DirectusPanel } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class PanelsCollection extends DirectusCollection<DirectusPanel> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    loggerService: LoggerService,
    dataDiffer: PanelsDataDiffer,
    dataLoader: PanelsDataLoader,
    dataClient: PanelsDataClient,
    dataMapper: PanelsDataMapper,
    idMapper: PanelsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      loggerService.getChild(PANELS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(PANELS_COLLECTION),
        preserveIds: config.shouldPreserveIds(PANELS_COLLECTION),
      },
    );
  }
}
