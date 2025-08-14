import { DataMapper, Field, IdMappers } from '../base';
import { Container, Service } from 'typedi';
import { LoggerService } from '../../logger';
import { ROLES_COLLECTION } from './constants';
import { DirectusRole } from './interfaces';
import { RolesIdMapperClient } from './id-mapper-client';

@Service()
export class RolesDataMapper extends DataMapper<DirectusRole> {
  protected fieldsToIgnore: Field<DirectusRole>[] = [
    'users',
    'children',
    'policies',
  ];
  protected idMappers: IdMappers<DirectusRole> = {
    parent: Container.get(RolesIdMapperClient),
  };

  constructor(loggerService: LoggerService) {
    super(loggerService.getChild(ROLES_COLLECTION));
  }
}
