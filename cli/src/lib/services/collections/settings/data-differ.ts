import { DataDiffer } from '../base';
import { DirectusSettings } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';
import pino from 'pino';
import { SettingsDataLoader } from './data-loader';
import { SettingsDataClient } from './data-client';
import { SettingsIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';

@Service()
export class SettingsDataDiffer extends DataDiffer<DirectusSettings<object>> {
  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    dataLoader: SettingsDataLoader,
    dataClient: SettingsDataClient,
    idMapper: SettingsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, SETTINGS_COLLECTION),
      dataLoader,
      dataClient,
      idMapper,
    );
  }
}
