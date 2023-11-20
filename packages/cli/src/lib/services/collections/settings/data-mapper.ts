import { DataMapper } from '../base';

import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { SETTINGS_COLLECTION } from './constants';
import { DirectusSettings } from './interfaces';

@Service()
export class SettingsDataMapper extends DataMapper<DirectusSettings> {
  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, SETTINGS_COLLECTION));
  }
}
