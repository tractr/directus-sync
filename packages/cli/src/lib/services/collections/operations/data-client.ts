import { Command, DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createOperation,
  deleteOperation,
  QueryFilter,
  readOperations,
  updateOperation,
  updateOperations,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusOperation } from './interfaces';
import { LoggerService } from '../../logger';
import { OPERATIONS_COLLECTION } from './constants';

@Service()
export class OperationsDataClient extends DataClient<DirectusOperation> {
  constructor(loggerService: LoggerService, migrationClient: MigrationClient) {
    super(loggerService.getChild(OPERATIONS_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteOperation(itemId);
  }

  protected async getInsertCommand(
    item: WithoutIdAndSyncId<DirectusOperation>,
  ) {
    const preCommands = await this.getCommandsToPreventConflicts(item);
    return [...preCommands, createOperation(item)] as [
      ...Command<object>[],
      Command<DirectusOperation>,
    ];
  }

  protected getQueryCommand(query: Query<DirectusOperation>) {
    return readOperations(query);
  }

  protected async getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusOperation>>,
  ) {
    const preCommands = await this.getCommandsToPreventConflicts(
      diffItem,
      itemId,
    );
    return [...preCommands, updateOperation(itemId, diffItem)] as [
      ...Command<object>[],
      Command<DirectusOperation>,
    ];
  }

  protected async getCommandsToPreventConflicts(
    diffItem: Partial<Pick<DirectusOperation, 'resolve' | 'reject'>>,
    itemId?: string,
  ): Promise<Command<object>[]> {
    const preCommands: Command<object>[] = [];

    if (diffItem.reject) {
      const command = await this.getCommandToNullifyTarget(
        'reject',
        diffItem,
        itemId,
      );
      if (command) {
        preCommands.push(command);
      }
    }
    if (diffItem.resolve) {
      const command = await this.getCommandToNullifyTarget(
        'resolve',
        diffItem,
        itemId,
      );
      if (command) {
        preCommands.push(command);
      }
    }

    return preCommands;
  }

  protected async getCommandToNullifyTarget(
    type: 'resolve' | 'reject',
    diffItem: Partial<WithoutIdAndSyncId<DirectusOperation>>,
    itemId?: string,
  ): Promise<Command<DirectusOperation> | undefined> {
    const ids = await this.getIdsForTarget(type, diffItem, itemId);
    if (ids.length === 0) {
      return;
    }
    return updateOperations(ids, { [type]: null });
  }

  protected async getIdsForTarget(
    type: 'resolve' | 'reject',
    diffItem: Partial<WithoutIdAndSyncId<DirectusOperation>>,
    itemId?: string,
  ): Promise<string[]> {
    // Build the filter
    const andFilters: QueryFilter<object, DirectusOperation>[] = [
      { [type]: { _eq: diffItem[type] } },
    ];
    if (itemId) {
      andFilters.push({ id: { _neq: itemId } });
    }

    const client = await this.migrationClient.get();
    const response = await client.request<{ id: string }[]>(
      readOperations({
        filter: {
          _and: andFilters,
        },
        fields: ['id'],
      }),
    );

    return response.map(({ id }) => id);
  }
}
