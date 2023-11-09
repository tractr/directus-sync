import { DataMapper, Field, IdMappers, StrictField } from '../base';
import { DirectusFlow } from '@directus/sdk';
import { Container, Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { FLOWS_COLLECTION } from './constants';
import { OperationsIdMapperClient } from '../operations';

@Service()
export class FlowsDataMapper extends DataMapper<DirectusFlow<object>> {
  protected usersFields: StrictField<DirectusFlow<object>>[] = [];
  protected fieldsToIgnore: Field<DirectusFlow<object>>[] = [
    'date_created',
    'user_created',
    'operations',
  ];
  protected idMappers: IdMappers<DirectusFlow<object>> = {
    operation: Container.get(OperationsIdMapperClient),
  };

  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION), migrationClient);
  }
}
