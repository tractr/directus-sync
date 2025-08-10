import { DataMapper, Field, IdMappers } from '../base';
import { Container, Service } from 'typedi';
import { LoggerService } from '../../logger';
import { PRESETS_COLLECTION } from './constants';
import { DirectusPreset } from './interfaces';
import { RolesIdMapperClient } from '../roles';

@Service()
export class PresetsDataMapper extends DataMapper<DirectusPreset> {
  protected fieldsToIgnore: Field<DirectusPreset>[] = ['user'];
  protected idMappers: IdMappers<DirectusPreset> = {
    role: Container.get(RolesIdMapperClient),
  };

  constructor(loggerService: LoggerService) {
    super(loggerService.getChild(PRESETS_COLLECTION));
  }
}
