import { DataMapper, Field, IdMappers } from '../base';
import { Container, Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
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

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, ROLES_COLLECTION));
  }
}
