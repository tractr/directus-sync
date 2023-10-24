// Use a memory sqlite database for testing the IdMapper class:
import * as Knex from 'knex';
import { IdMapper} from './id-mapper';

describe('IdMapper', () => {
    let idMapper: IdMapper;
    let database: Knex.Knex;

    beforeEach(async () => {
        // Create a new in-memory database before each test
        database = Knex.knex({
            client: 'sqlite3',
            connection: {
                filename: ':memory:'
            },
            useNullAsDefault: true
        });
        // Create a mapper
        idMapper = new IdMapper(database);
    });

    afterEach(async () => {
        await database.destroy();
    });

    it('should not create table if not initialized', async () => {
        const tableName = idMapper.getTableName();
        const hasTable = await database.schema.hasTable(tableName);
        expect(hasTable).toBe(false);
    });

    it('should create table if initialized', async () => {
        await idMapper.init();
        const tableName = idMapper.getTableName();
        const hasTable = await database.schema.hasTable(tableName);
        expect(hasTable).toBe(true);
    });

    it('should get table name', async () => {
        expect(idMapper.getTableName()).toBe('directus_sync_id_map');
    });

    it('should add an id map and retrieve it from local id or sync id', async () => {
        await idMapper.init();
        await idMapper.add('directus_hooks', 'sync_id_1', 'local_id_1');
        await idMapper.add('directus_hooks', 'sync_id_2', 'local_id_2');
        await idMapper.add('directus_users', 'sync_id_3', 'local_id_3');

        const localId1 = await idMapper.getLocalId('directus_hooks', 'sync_id_1');
        expect(localId1).toBe('local_id_1');

        const localId2 = await idMapper.getLocalId('directus_hooks', 'sync_id_2');
        expect(localId2).toBe('local_id_2');

        const localId3 = await idMapper.getLocalId('directus_users', 'sync_id_3');
        expect(localId3).toBe('local_id_3');

        const syncId1 = await idMapper.getSyncId('directus_hooks', 'local_id_1');
        expect(syncId1).toBe('sync_id_1');

        const syncId2 = await idMapper.getSyncId('directus_hooks', 'local_id_2');
        expect(syncId2).toBe('sync_id_2');

        const syncId3 = await idMapper.getSyncId('directus_users', 'local_id_3');
        expect(syncId3).toBe('sync_id_3');

        // Count the number of rows in the table
        const count: { 'count(*)': number }[] = await database(idMapper.getTableName()).count('*');
        expect(count[0]).toBeDefined();
        if (!count[0]) {
            throw new Error('Count should be defined');
        }
        expect(count[0]["count(*)"]).toBe(3);
    });


    it('should remove entries by local id and sync id', async () => {
        await idMapper.init();
        await idMapper.add('directus_hooks', 'sync_id_1', 'local_id_1');
        await idMapper.add('directus_hooks', 'sync_id_2', 'local_id_2');
        await idMapper.add('directus_users', 'sync_id_3', 'local_id_3');

        await idMapper.removeBySyncId('directus_hooks', 'sync_id_1');

        await expect(idMapper.getLocalId('directus_hooks', 'sync_id_1')).rejects.toThrow("No local id found for table directus_hooks and sync id sync_id_1");
        await expect(idMapper.getSyncId('directus_hooks', 'local_id_1')).rejects.toThrow("No sync id found for table directus_hooks and local id local_id_1");

        await idMapper.removeBySyncId('directus_users', 'sync_id_3');
        await expect(idMapper.getLocalId('directus_users', 'sync_id_3')).rejects.toThrow("No local id found for table directus_users and sync id sync_id_3");
        await expect(idMapper.getSyncId('directus_users', 'local_id_3')).rejects.toThrow("No sync id found for table directus_users and local id local_id_3");

        // Count the number of rows in the table
        const count: { 'count(*)': number }[] = await database(idMapper.getTableName()).count('*');
        expect(count[0]).toBeDefined();
        if (!count[0]) {
            throw new Error('Count should be defined');
        }
        expect(count[0]["count(*)"]).toBe(1);
    });

    it('should throw error if the local id is not found', async () => {
        await idMapper.init();
        await expect(idMapper.getLocalId('users', '123')).rejects.toThrow("No local id found for table users and sync id 123");
    });

    it('should throw error if the sync id is not found', async () => {
        await idMapper.init();
        await expect(idMapper.getSyncId('users', '123')).rejects.toThrow("No sync id found for table users and local id 123");
    });

    it('should throw error if entry is added twice', async () => {
        await idMapper.init();
        await idMapper.add('directus_hooks', 'sync_id_1', 'local_id_1');
        await expect(idMapper.add('directus_hooks', 'sync_id_1', 'local_id_1')).rejects.toThrow("UNIQUE constraint failed: directus_sync_id_map.table, directus_sync_id_map.local_id");
    });

});
