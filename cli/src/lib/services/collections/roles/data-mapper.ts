import { DataMapper, Field, IdMappers, StrictField } from '../base';
import { DirectusRole } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { FLOWS_COLLECTION } from '../flows';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';

@Service()
export class RolesDataMapper extends DataMapper<DirectusRole<object>> {
  protected usersFields: StrictField<DirectusRole<object>>[] = [];
  protected fieldsToIgnore: Field<DirectusRole<object>>[] = ['users'];
  protected idMappers: IdMappers<DirectusRole<object>> = {};

  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION), migrationClient);
  }
}
