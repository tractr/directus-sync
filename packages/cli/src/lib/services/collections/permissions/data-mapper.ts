import { DataMapper, Field, IdMappers } from '../base';
import { Container, Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { PoliciesIdMapperClient } from '../policies';
import { LOGGER } from '../../../constants';
import { PERMISSIONS_COLLECTION } from './constants';
import { DirectusPermission } from './interfaces';

@Service()
export class PermissionsDataMapper extends DataMapper<DirectusPermission> {
  protected fieldsToIgnore: Field<DirectusPermission>[] = [];
  protected idMappers: IdMappers<DirectusPermission> = {
    // @ts-ignore TODO: remove this "ts-ignore" once this PR has been merged: https://github.com/directus/directus/pull/23380
    policy: Container.get(PoliciesIdMapperClient),
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, PERMISSIONS_COLLECTION));
  }
}
