import {Knex} from "knex";

type PrimaryKeyType = 'integer' | 'string';


export class IdMapper {

    protected readonly table = 'directus_sync_id_map';

    protected directusTablePrefix = 'directus_';

    protected tablePrimaryKeys: Record<string, PrimaryKeyType> | undefined;

    constructor(protected readonly database: Knex) {

    }
     async init() {
        if (!await this.database.schema.hasTable(this.table)) {
            await this.database.schema.createTable(this.table, (table) => {
                table.string('table').notNullable();
                table.string('sync_id').notNullable();
                table.string('local_id').notNullable();
                table.primary(['table', 'sync_id']);
                table.index(['table', 'local_id']);
            });
        }
     }


    /**
     * Returns all tables that start with the directus prefix
     */
    protected async getDirectusTables(): Promise<string[]> {
        const tables = await this.database.raw('SHOW TABLES');
        return tables[0].filter((table: string) => table.startsWith(this.directusTablePrefix));
    }

    /**
     * For each table, denotes if the primary key is an auto-incrementing integer or a string (UUID)
     */
    protected async getTablePrimaryKeysTypes(): Promise<Record<string, PrimaryKeyType>> {
        const tables = await this.getDirectusTables();
        const tablePrimaryKeys: Record<string, PrimaryKeyType> = {};
        for (const table of tables) {
            const columns = await this.database.raw(`SHOW COLUMNS FROM ${table}`);
            const primaryKey = columns[0].find((column: any) => column.Key === 'PRI');
            if (primaryKey) {
                tablePrimaryKeys[table] = primaryKey.Type.startsWith('int') ? 'integer' : 'string';
            }
        }
        return tablePrimaryKeys;
    }

    /**
     * Defines the primary keys for each table and caches the result.
     * Returns the primary key for the given table.
     */
    protected async getTablePrimaryKeyType(table: string): Promise<PrimaryKeyType> {
        if (!this.tablePrimaryKeys) {
            this.tablePrimaryKeys = await this.getTablePrimaryKeysTypes();
        }
        // If the table doesn't have a primary key, we can't sync it, throw an error
        const primaryKeyType = this.tablePrimaryKeys[table];
        if (!primaryKeyType) {
            throw new Error(`Table ${table} is not a Directus table or does not have a primary key`);
        }
        return primaryKeyType;
    }

    /**
     * Returns the local key for the given table and sync id
     */
    async getLocalId(table: string, syncId: string): Promise<number | string> {
        const primaryKeyType = await this.getTablePrimaryKeyType(table);
        const result = await this.database(this.table).where({ table, sync_id: syncId }).first();
        if (!result) {
            throw new Error(`No local id found for table ${table} and sync id ${syncId}`);
        }
        // Map the local id to the correct type
        return primaryKeyType === 'integer' ? parseInt(result.local_id) : result.local_id.toString();
    }

    /**
     * Returns the sync id for the given table and local id
     */
    async getSyncId(table: string, localId: number | string): Promise<string> {
        const result = await this.database(this.table).where({ table, local_id: localId }).first();
        if (!result) {
            throw new Error(`No sync id found for table ${table} and local id ${localId}`);
        }
        return result.sync_id;
    }
}