import { Knex } from 'knex';
import { randomUUID } from 'crypto';

export interface IdMap {
  id: number;
  table: string;
  sync_id: string;
  local_id: string;
  created_at: Date;
}

export class IdMapper {
  protected readonly tableName = 'directus_sync_id_map';

  constructor(protected readonly database: Knex) {}

  /**
   * Init the id mapper by creating the table if it doesn't exist
   * returns true if the table was created, false if it already existed
   */
  async init(): Promise<boolean> {
    if (!(await this.database.schema.hasTable(this.tableName))) {
      await this.database.schema.createTable(this.tableName, (table) => {
        table.increments('id').primary();
        table.string('table').notNullable();
        table.string('sync_id').notNullable();
        table.string('local_id').notNullable();
        table.timestamp('created_at').defaultTo(this.database.fn.now());
        table.unique(['table', 'sync_id']);
        table.unique(['table', 'local_id']);
        table.index(['created_at']);
      });
      return true;
    }
    return false;
  }

  /**
   * Get the table name
   */
  getTableName(): string {
    return this.tableName;
  }

  /**
   * Returns the local key for the given table and sync id
   */
  async getBySyncId(table: string, syncId: string): Promise<IdMap | null> {
    const result: IdMap = await this.database(this.tableName)
      .where({ table, sync_id: syncId })
      .first();
    return result || null;
  }

  /**
   * Returns the sync id for the given table and local id
   */
  async getByLocalId(
    table: string,
    localId: string | number,
  ): Promise<IdMap | null> {
    const result: IdMap = await this.database(this.tableName)
      .where({ table, local_id: localId })
      .first();
    return result || null;
  }

  /**
   * Get all entries for the given table
   */
  async getAll(table: string): Promise<IdMap[]> {
    return this.database(this.tableName).where({ table });
  }

  /**
   * Adds a new entry to the id map
   * Generates a new sync id if not provided.
   * Sync id will be provided when restoring data, and not provided when backing up data.
   */
  async add(
    table: string,
    localId: number | string,
    syncId?: string,
  ): Promise<string> {
    const finalSyncId = syncId || randomUUID();
    await this.database(this.tableName).insert({
      table,
      sync_id: finalSyncId,
      local_id: localId,
    });
    return finalSyncId;
  }

  /**
   * Removes an entry from the id map using the sync id
   */
  async removeBySyncId(table: string, syncId: string): Promise<void> {
    await this.database(this.tableName)
      .where({ table, sync_id: syncId })
      .delete();
  }

  /**
   * Removes an entry from the id map using the local id
   */
  async removeByLocalId(
    table: string,
    localId: number | string,
  ): Promise<void> {
    await this.database(this.tableName)
      .where({ table, local_id: localId })
      .delete();
  }
}
