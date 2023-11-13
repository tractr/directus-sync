import { DataMapper, Field, IdMappers } from '../base';
import { DirectusPermission } from '@directus/sdk';
import { Container, Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { RolesIdMapperClient } from '../roles';
import { LOGGER } from '../../../constants';
import { PERMISSIONS_COLLECTION } from './constants';

@Service()
export class PermissionsDataMapper extends DataMapper<
  DirectusPermission<object>
> {
  protected fieldsToIgnore: Field<DirectusPermission<object>>[] = [];
  protected idMappers: IdMappers<DirectusPermission<object>> = {
    role: Container.get(RolesIdMapperClient),
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, PERMISSIONS_COLLECTION));
  }
}