import { DataMapper, Field } from '../base';

import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { SETTINGS_COLLECTION } from './constants';
import { DirectusSettings } from './interfaces';

@Service()
export class SettingsDataMapper extends DataMapper<DirectusSettings> {
  protected fieldsToIgnore: Field<DirectusSettings>[] = [
    // These fields are not relevant meanwhile assets are not supported
    'project_logo',
    'public_foreground',
    'public_background',
    // Not relevant for migrations. URL are different for each environment. Can be set with env variables.
    'project_url',
  ];
  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, SETTINGS_COLLECTION));
  }
}
