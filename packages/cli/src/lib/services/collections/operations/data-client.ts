import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createOperation,
  deleteOperation,
  readOperations,
  updateOperation,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusOperation } from './interfaces';

@Service()
export class OperationsDataClient extends DataClient<DirectusOperation> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteOperation(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusOperation>) {
    return createOperation(item);
  }

  protected getQueryCommand(query: Query<DirectusOperation>) {
    return readOperations(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusOperation>>,
  ) {
    return updateOperation(itemId, diffItem);
  }
}
