import {
  Command,
  MultipleRestCommand,
  SingleRestCommand,
  DirectusBaseType,
  DirectusId,
  Query,
  WithoutIdAndSyncId,
  WithoutSyncId,
} from './interfaces';
import { MigrationClient } from '../../migration-client';

/**
 * This class is responsible for calling CRUD operations on the target collection using the rest API.
 */
export abstract class DataClient<DirectusType extends DirectusBaseType> {
  constructor(protected readonly migrationClient: MigrationClient) {}

  /**
   * Request data from the target collection using the rest API.
   */
  async query<T extends object = DirectusType>(
    query: Query<DirectusType>,
  ): Promise<T[]> {
    const directus = await this.migrationClient.get();
    const response = await directus.request<T | T[]>(
      await this.getQueryCommand(query),
    );
    // Some collections, such as settings, return a single object instead of an array or may return a fake item, without id.
    if (Array.isArray(response)) {
      return response;
    } else {
      if (!(response as DirectusType).id) {
        return [];
      }
      return [response as T];
    }
  }

  /**
   * Inserts data into the target collection using the rest API.
   * Remove the id and the syncId from the item before inserting it.
   */
  async create(item: WithoutSyncId<DirectusType>): Promise<DirectusType> {
    return await this.executeCommandsInSequence(
      await this.getInsertCommand(item),
    );
  }

  /**
   * Updates data in the target collection using the rest API.
   * The diff item already excludes the id and the syncId.
   */
  async update(
    itemId: DirectusId,
    diffItem: Partial<WithoutIdAndSyncId<DirectusType>>,
  ): Promise<DirectusType> {
    return await this.executeCommandsInSequence(
      await this.getUpdateCommand(itemId, diffItem),
    );
  }

  /**
   * Deletes data from the target collection using the rest API.
   * The id is the local id.
   */
  async delete(itemId: DirectusId): Promise<DirectusType> {
    return await this.executeCommandsInSequence(
      await this.getDeleteCommand(itemId),
    );
  }

  /**
   * Execute commands in sequence and return the last result.
   */
  protected async executeCommandsInSequence(
    commands:
      | Command<DirectusType>
      | [...Command<object>[], Command<DirectusType>],
  ): Promise<DirectusType> {
    const directus = await this.migrationClient.get();
    const [preCommands, lastCommand] = this.splitCommands(commands);
    for (const command of preCommands) {
      await directus.request(command);
    }
    return await directus.request(lastCommand);
  }

  /**
   * Split the pre-commands and the final command.
   */
  protected splitCommands(
    commands:
      | Command<DirectusType>
      | [...Command<object>[], Command<DirectusType>],
  ): [Command<object>[], Command<DirectusType>] {
    if (Array.isArray(commands)) {
      const lastCommand = commands[commands.length - 1]!;
      const preCommands = commands.slice(0, -1);
      return [preCommands, lastCommand];
    } else {
      return [[], commands];
    }
  }

  protected abstract getQueryCommand(
    query: Query<DirectusType>,
  ): SingleRestCommand<DirectusType>;

  protected abstract getInsertCommand(
    item: WithoutSyncId<DirectusType>,
  ): MultipleRestCommand<DirectusType>;

  protected abstract getUpdateCommand(
    itemId: DirectusId,
    diffItem: Partial<WithoutIdAndSyncId<DirectusType>>,
  ): MultipleRestCommand<DirectusType>;

  protected abstract getDeleteCommand(
    itemId: DirectusId,
  ): MultipleRestCommand<DirectusType>;
}
