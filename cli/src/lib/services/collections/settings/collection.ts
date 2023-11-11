import 'dotenv/config';
import { DirectusSettings } from '@directus/sdk';
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
import {LOGGER} from "../../../constants";

@Service()
export class SettingsCollection extends DirectusCollection<
  DirectusSettings<object>
> {
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
  ) {
    super(
      getChildLogger(baseLogger, SETTINGS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
