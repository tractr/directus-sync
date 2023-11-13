import { DataMapper, Field, IdMappers } from '../base';
import { DirectusRole } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { ROLES_COLLECTION } from './constants';

@Service()
export class RolesDataMapper extends DataMapper<DirectusRole<object>> {
  protected fieldsToIgnore: Field<DirectusRole<object>>[] = ['users'];
  protected idMappers: IdMappers<DirectusRole<object>> = {};

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, ROLES_COLLECTION));
  }
}