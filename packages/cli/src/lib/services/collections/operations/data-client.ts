import { Command, DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createOperation,
  deleteOperation,
  readOperations,
  updateOperation,
  updateOperations,
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

  protected async getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusOperation>>,
  ) {
    const preCommands: Command<object>[] = [];

    // Avoid conflict with unique constraint in resolve and reject columns
    // https://github.com/tractr/directus-sync/issues/46
    if (diffItem.reject) {
      const command = await this.getCommandToNullifyTarget(
        'reject',
        itemId,
        diffItem,
      );
      if (command) {
        preCommands.push(command);
      }
    }
    if (diffItem.resolve) {
      const command = await this.getCommandToNullifyTarget(
        'resolve',
        itemId,
        diffItem,
      );
      if (command) {
        preCommands.push(command);
      }
    }

    return [...preCommands, updateOperation(itemId, diffItem)] as [
      ...Command<object>[],
      Command<DirectusOperation>,
    ];
  }

  protected async getCommandToNullifyTarget(
    type: 'resolve' | 'reject',
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusOperation>>,
  ): Promise<Command<DirectusOperation> | undefined> {
    const ids = await this.getIdsForTarget(type, itemId, diffItem);
    if (ids.length === 0) {
      return;
    }
    return updateOperations(ids, { [type]: null });
  }

  protected async getIdsForTarget(
    type: 'resolve' | 'reject',
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusOperation>>,
  ): Promise<string[]> {
    const client = await this.migrationClient.get();
    const response = await client.request<{ id: string }[]>(
      readOperations({
        filter: {
          _and: [{ [type]: { _eq: diffItem[type] } }, { id: { _neq: itemId } }],
        },
        fields: ['id'],
      }),
    );

    return response.map(({ id }) => id);
  }
}
