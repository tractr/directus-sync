import { DataDiffer } from '../base';

import { Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';
import { SettingsDataLoader } from './data-loader';
import { SettingsDataClient } from './data-client';
import { SettingsIdMapperClient } from './id-mapper-client';
import { LoggerService } from '../../logger';
import { SettingsDataMapper } from './data-mapper';
import { DirectusSettings } from './interfaces';

@Service()
export class SettingsDataDiffer extends DataDiffer<DirectusSettings> {
  constructor(
    loggerService: LoggerService,
    dataLoader: SettingsDataLoader,
    dataClient: SettingsDataClient,
    dataMapper: SettingsDataMapper,
    idMapper: SettingsIdMapperClient,
  ) {
    super(
      loggerService.getChild(SETTINGS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
