import { DataClient, WithoutIdAndSyncId } from '../base';
import {
  createOperation,
  deleteOperation,
  DirectusOperation,
  Query,
  readOperations,
  updateOperation,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';

@Service()
export class OperationsDataClient extends DataClient<
  DirectusOperation<object>
> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteOperation(itemId);
  }

  protected getInsertCommand(
    item: WithoutIdAndSyncId<DirectusOperation<object>>,
  ) {
    return createOperation(item);
  }

  protected getQueryCommand(query: Query<DirectusOperation<object>, object>) {
    return readOperations(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusOperation<object>>>,
  ) {
    return updateOperation(itemId, diffItem);
  }
}
