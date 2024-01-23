import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { SettingsDataLoader } from './data-loader';
import { SettingsDataClient } from './data-client';
import { SettingsIdMapperClient } from './id-mapper-client';
import { SettingsDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { SETTINGS_COLLECTION } from './constants';
import { SettingsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusSettings } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class SettingsCollection extends DirectusCollection<DirectusSettings> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = false;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataDiffer: SettingsDataDiffer,
    dataLoader: SettingsDataLoader,
    dataClient: SettingsDataClient,
    dataMapper: SettingsDataMapper,
    idMapper: SettingsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      getChildLogger(baseLogger, SETTINGS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      config.getHooksConfig(SETTINGS_COLLECTION),
    );
  }
}
