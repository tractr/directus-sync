import { DataMapper, Field, IdMappers, StrictField } from '../base';
import { DirectusPermission } from '@directus/sdk';
import { Container, Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { FLOWS_COLLECTION } from '../flows';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { RolesIdMapperClient } from '../roles';

@Service()
export class PermissionsDataMapper extends DataMapper<
  DirectusPermission<object>
> {
  protected usersFields: StrictField<DirectusPermission<object>>[] = [];
  protected fieldsToIgnore: Field<DirectusPermission<object>>[] = [];
  protected idMappers: IdMappers<DirectusPermission<object>> = {
    role: Container.get(RolesIdMapperClient),
  };

  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION), migrationClient);
  }
}
