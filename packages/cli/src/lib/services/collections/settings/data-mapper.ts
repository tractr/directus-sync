import { DataMapper, Field, IdMappers } from '../base';

import { Container, Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { SETTINGS_COLLECTION } from './constants';
import { DirectusSettings } from './interfaces';
import { RolesIdMapperClient } from '../roles';

@Service()
export class SettingsDataMapper extends DataMapper<DirectusSettings> {
  protected fieldsToIgnore: Field<DirectusSettings, 'public_favicon'>[] = [
    // These fields are not relevant meanwhile assets are not supported
    'project_logo',
    'public_foreground',
    'public_background',
    'public_favicon',
    // Not relevant for migrations. URL are different for each environment. Can be set with env variables.
    'project_url',
  ];
  protected idMappers: IdMappers<DirectusSettings, 'public_registration_role'> = {
    public_registration_role: Container.get(RolesIdMapperClient),
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, SETTINGS_COLLECTION));
  }
}
