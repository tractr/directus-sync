import { DataMapper, Field, IdMappers } from '../base';
import { Container, Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { PRESETS_COLLECTION } from './constants';
import { DirectusPreset } from './interfaces';
import { RolesIdMapperClient } from '../roles';

@Service()
export class PresetsDataMapper extends DataMapper<DirectusPreset> {
  protected fieldsToIgnore: Field<DirectusPreset>[] = ['user'];
  protected idMappers: IdMappers<DirectusPreset> = {
    role: Container.get(RolesIdMapperClient),
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, PRESETS_COLLECTION));
  }
}
