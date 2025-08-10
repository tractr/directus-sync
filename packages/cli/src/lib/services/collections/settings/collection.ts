import { DirectusCollection } from '../base';
import { Service } from 'typedi';
import { SettingsDataLoader } from './data-loader';
import { SettingsDataClient } from './data-client';
import { SettingsIdMapperClient } from './id-mapper-client';
import { SettingsDataDiffer } from './data-differ';
import { LoggerService } from '../../logger';
import { SETTINGS_COLLECTION } from './constants';
import { SettingsDataMapper } from './data-mapper';
import { DirectusSettings } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class SettingsCollection extends DirectusCollection<DirectusSettings> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = false;

  constructor(
    loggerService: LoggerService,
    dataDiffer: SettingsDataDiffer,
    dataLoader: SettingsDataLoader,
    dataClient: SettingsDataClient,
    dataMapper: SettingsDataMapper,
    idMapper: SettingsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      loggerService.getChild(SETTINGS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(SETTINGS_COLLECTION),
      },
    );
  }
}
