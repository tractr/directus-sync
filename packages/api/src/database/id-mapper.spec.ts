// Use a memory sqlite database for testing the IdMapper class:
import * as Knex from 'knex';
import { IdMapper } from './id-mapper';

describe('IdMapper', () => {
  let idMapper: IdMapper;
  let database: Knex.Knex;

  beforeEach(() => {
    // Create a new in-memory database before each test
    database = Knex.knex({
      client: 'sqlite3',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
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
    const created = await idMapper.init();
    const tableName = idMapper.getTableName();
    const hasTable = await database.schema.hasTable(tableName);
    expect(hasTable).toBe(true);
    expect(created).toBe(true);

    // Should not create table if already initialized
    const created2 = await idMapper.init();
    expect(created2).toBe(false);
  });

  it('should get table name', () => {
    expect(idMapper.getTableName()).toBe('directus_sync_id_map');
  });

  it('should add an id map and retrieve it from local id or sync id', async () => {
    await idMapper.init();
    const newSyncId1 = await idMapper.add('directus_hooks', 'local_id_1');
    const newSyncId2 = await idMapper.add('directus_hooks', 'local_id_2');
    const newSyncId3 = await idMapper.add('directus_users', 'local_id_3');

    const result1 = (await idMapper.getBySyncId('directus_hooks', newSyncId1))!;
    expect(result1.sync_id).toBe(newSyncId1);
    expect(result1.local_id).toBe('local_id_1');
    expect(result1.table).toBe('directus_hooks');
    expect(result1.id).toBeDefined();
    expect(result1.created_at).toBeDefined();

    const { local_id: localId2 } = (await idMapper.getBySyncId(
      'directus_hooks',
      newSyncId2,
    ))!;
    expect(localId2).toBe('local_id_2');

    const { local_id: localId3 } = (await idMapper.getBySyncId(
      'directus_users',
      newSyncId3,
    ))!;
    expect(localId3).toBe('local_id_3');

    const { sync_id: syncId1 } = (await idMapper.getByLocalId(
      'directus_hooks',
      'local_id_1',
    ))!;
    expect(syncId1).toBe(newSyncId1);

    const { sync_id: syncId2 } = (await idMapper.getByLocalId(
      'directus_hooks',
      'local_id_2',
    ))!;
    expect(syncId2).toBe(newSyncId2);

    const { sync_id: syncId3 } = (await idMapper.getByLocalId(
      'directus_users',
      'local_id_3',
    ))!;
    expect(syncId3).toBe(newSyncId3);

    // Count the number of rows in the table
    const count: { 'count(*)': number }[] = await database(
      idMapper.getTableName(),
    ).count('*');
    expect(count[0]).toBeDefined();
    if (!count[0]) {
      throw new Error('Count should be defined');
    }
    expect(count[0]['count(*)']).toBe(3);
  });

  it('should remove entries by local id and sync id', async () => {
    await idMapper.init();
    const newSyncId1 = await idMapper.add('directus_hooks', 'local_id_1');
    await idMapper.add('directus_hooks', 'local_id_2');
    const newSyncId3 = await idMapper.add('directus_users', 'local_id_3');

    await idMapper.removeBySyncId('directus_hooks', newSyncId1);

    expect(await idMapper.getBySyncId('directus_hooks', newSyncId1)).toBeNull();
    expect(
      await idMapper.getByLocalId('directus_hooks', 'local_id_1'),
    ).toBeNull();

    await idMapper.removeBySyncId('directus_users', newSyncId3);
    expect(await idMapper.getBySyncId('directus_users', newSyncId3)).toBeNull();
    expect(
      await idMapper.getByLocalId('directus_users', 'local_id_3'),
    ).toBeNull();

    // Remove twice should not throw error
    await idMapper.removeBySyncId('directus_hooks', newSyncId1);

    // Remove by local id
    await idMapper.removeByLocalId('directus_hooks', 'local_id_2');
    expect(await idMapper.getBySyncId('directus_hooks', newSyncId1)).toBeNull();

    // Count the number of rows in the table
    const count: { 'count(*)': number }[] = await database(
      idMapper.getTableName(),
    ).count('*');
    expect(count[0]).toBeDefined();
    if (!count[0]) {
      throw new Error('Count should be defined');
    }
    expect(count[0]['count(*)']).toBe(0);
  });

  it('should returns all entries for a table', async () => {
    await idMapper.init();
    const newSyncId1 = await idMapper.add('directus_hooks', 'local_id_1');
    const newSyncId2 = await idMapper.add('directus_hooks', 'local_id_2');
    await idMapper.add('directus_users', 'local_id_3');

    const entries = await idMapper.getAll('directus_hooks');
    expect(entries.find((e) => e.sync_id === newSyncId1)).toBeDefined();
    expect(entries.find((e) => e.sync_id === newSyncId2)).toBeDefined();
  });

  it('should return null if the local id is not found', async () => {
    await idMapper.init();
    expect(await idMapper.getBySyncId('users', '123')).toBeNull();
  });

  it('should return null if the sync id is not found', async () => {
    await idMapper.init();
    expect(await idMapper.getByLocalId('users', '123')).toBeNull();
  });

  it('should throw error if entry is added twice', async () => {
    await idMapper.init();
    await idMapper.add('directus_hooks', 'local_id_1');
    await expect(idMapper.add('directus_hooks', 'local_id_1')).rejects.toThrow(
      'UNIQUE constraint failed: directus_sync_id_map.table, directus_sync_id_map.local_id',
    );
  });

  it('should be able to force sync id on creation', async () => {
    await idMapper.init();
    const newSyncId1 = await idMapper.add(
      'directus_hooks',
      'local_id_1',
      'sync_id_1',
    );
    expect(newSyncId1).toBe('sync_id_1');
    const idMap1 = await idMapper.getBySyncId('directus_hooks', 'sync_id_1');
    expect(idMap1).toBeDefined();
  });
});
