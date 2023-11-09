import { DataMapper, Field, IdMappers, StrictField } from '../base';
import { DirectusFlow } from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';

@Service()
export class FlowsDataMapper extends DataMapper<DirectusFlow<object>> {
  protected usersFields: StrictField<DirectusFlow<object>>[] = [];
  protected fieldsToIgnore: Field<DirectusFlow<object>>[] = [
    'user_created',
    'operations',
    'operation',
  ];
  protected idMappers: IdMappers<DirectusFlow<object>> = {};

  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }
}
