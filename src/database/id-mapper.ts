import {Knex} from "knex";

type PrimaryKeyType = 'integer' | 'string';

export type IdMap = {
    table: string;
    sync_id: string;
    local_id: string;
    created_at: Date;
}

export class IdMapper {

    protected readonly tableName = 'directus_sync_id_map';

    protected readonly directusTablePrefix = 'directus_';

    protected tablePrimaryKeys: Record<string, PrimaryKeyType> | undefined;

    constructor(protected readonly database: Knex) {

    }

    /**
     * Init the id mapper by creating the table if it doesn't exist
     */
    async init() {
        if (!await this.database.schema.hasTable(this.tableName)) {
            await this.database.schema.createTable(this.tableName, (table) => {
                table.string('table').notNullable();
                table.string('sync_id').notNullable();
                table.string('local_id').notNullable();
                table.timestamp('created_at').defaultTo(this.database.fn.now());
                table.primary(['table', 'sync_id']);
                table.unique(['table', 'local_id']);
                table.index(['created_at']);
            });
        }
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
    async getLocalId(table: string, syncId: string): Promise<string> {
        const result: IdMap = await this.database(this.tableName).where({ table, sync_id: syncId }).first();
        if (!result) {
            throw new Error(`No local id found for table ${table} and sync id ${syncId}`);
        }
        // Map the local id to the correct type
        return result.local_id;
    }

    /**
     * Returns the sync id for the given table and local id
     */
    async getSyncId(table: string, localId: string): Promise<string> {
        const result: IdMap = await this.database(this.tableName).where({ table, local_id: localId }).first();
        if (!result) {
            throw new Error(`No sync id found for table ${table} and local id ${localId}`);
        }
        return result.sync_id;
    }

    /**
     * Adds a new entry to the id map
     */
    async add(table: string, syncId: string, localId: number | string): Promise<void> {
        await this.database(this.tableName).insert({ table, sync_id: syncId, local_id: localId });
    }

    /**
     * Removes an entry from the id map using the sync id
     */
    async removeBySyncId(table: string, syncId: string): Promise<void> {
        await this.database(this.tableName).where({ table, sync_id: syncId }).delete();
    }

    /**
     * Removes an entry from the id map using the local id
     */
    async removeByLocalId(table: string, localId: number | string): Promise<void> {
        await this.database(this.tableName).where({ table, local_id: localId }).delete();
    }
}
