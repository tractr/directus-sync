import { DataMapper, Field, IdMappers, StrictField } from '../base';
import { DirectusOperation } from '@directus/sdk';
import { Container, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { FlowsIdMapperClient } from '../flows';
import { OperationsIdMapperClient } from './id-mapper-client';

@Service()
export class OperationsDataMapper extends DataMapper<
  DirectusOperation<object>
> {
  protected usersFields: StrictField<DirectusOperation<object>>[] = [];
  protected fieldsToIgnore: Field<DirectusOperation<object>>[] = [
    'user_created',
  ];
  protected idMappers: IdMappers<DirectusOperation<object>> = {
    flow: Container.get(FlowsIdMapperClient),
    resolve: Container.get(OperationsIdMapperClient),
    reject: Container.get(OperationsIdMapperClient),
  };

  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }
}
