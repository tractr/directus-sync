import { DataMapper, Field, IdMappers, StrictField } from '../base';
import { DirectusOperation } from '@directus/sdk';
import { Container, Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { FLOWS_COLLECTION, FlowsIdMapperClient } from '../flows';
import { OperationsIdMapperClient } from './id-mapper-client';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';

@Service()
export class OperationsDataMapper extends DataMapper<
  DirectusOperation<object>
> {
  protected usersFields: StrictField<DirectusOperation<object>>[] = [];
  protected fieldsToIgnore: Field<DirectusOperation<object>>[] = [
    'date_created',
    'user_created',
  ];
  protected idMappers: IdMappers<DirectusOperation<object>> = {
    flow: Container.get(FlowsIdMapperClient),
    resolve: Container.get(OperationsIdMapperClient),
    reject: Container.get(OperationsIdMapperClient),
  };

  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION), migrationClient);
  }
}
