import { DataMapper, Field, IdMappers } from '../base';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { ROLES_COLLECTION } from './constants';
import { DirectusRole } from './interfaces';

@Service()
export class RolesDataMapper extends DataMapper<DirectusRole> {
  protected fieldsToIgnore: Field<DirectusRole, 'users'>[] = ['users'];
  protected idMappers: IdMappers<DirectusRole> = {};

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, ROLES_COLLECTION));
  }
}
