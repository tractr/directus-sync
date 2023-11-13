import { DataMapper } from '../base';
import { DirectusSettings } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { SETTINGS_COLLECTION } from './constants';

@Service()
export class SettingsDataMapper extends DataMapper<DirectusSettings<object>> {
  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, SETTINGS_COLLECTION));
  }
}
