import fs from 'fs-extra';
import path from 'path';
import sqlite3 from 'sqlite3';

const directusBaseFolder = path.resolve('directus');
const baseDbPath = path.resolve(directusBaseFolder, 'db', 'base.db');
const testDbPath = path.resolve(directusBaseFolder, 'db', 'test.db');

type Row<T = never> = Record<string, unknown> & T;

export class SqliteClient {
  protected readonly baseDb: sqlite3.Database;
  protected readonly testDb: sqlite3.Database;

  constructor() {
    this.createTestDbFile();
    this.baseDb = new sqlite3.Database(baseDbPath);
    this.testDb = new sqlite3.Database(testDbPath);
  }

  protected createTestDbFile() {
    if (fs.existsSync(testDbPath)) {
      fs.rmSync(testDbPath);
    }
    fs.copyFileSync(baseDbPath, testDbPath);
  }

  /**
   * This method read all tables from the base database and copy them to the test database.
   * At the end the test database should be a clone of the base database.
   */
  async reset() {
    const baseTables = await getTables(this.baseDb);
    const testTables = await getTables(this.testDb);
    const tablesToKeep = [...new Set([...baseTables, 'directus_sync_id_map'])];

    await truncateTables(this.testDb, testTables);

    await dropExtraTables(this.testDb, tablesToKeep);

    await copyTables(this.baseDb, this.testDb, baseTables);
  }
}

/*
 * Helper functions
 */

function getTables(db: sqlite3.Database) {
  return new Promise<string[]>((resolve, reject) => {
    db.all(
      `SELECT name FROM sqlite_master WHERE type='table'`,
      (error, rows: Row<{ name: string }>[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows.map((row) => row.name));
        }
      },
    );
  });
}

async function truncateTables(db: sqlite3.Database, tables: string[]) {
  for (const table of tables) {
    await truncateTable(db, table);
  }
}

async function dropExtraTables(db: sqlite3.Database, references: string[]) {
  const tables = await getTables(db);
  for (const table of tables) {
    if (!references.includes(table)) {
      await dropTable(db, table);
    }
  }
}

function dropTable(db: sqlite3.Database, table: string) {
  return new Promise<void>((resolve, reject) => {
    db.run(`DROP TABLE IF EXISTS ${table}`, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function truncateTable(db: sqlite3.Database, table: string) {
  return new Promise<void>((resolve, reject) => {
    db.run(`DELETE FROM ${table}`, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function copyTables(
  source: sqlite3.Database,
  destination: sqlite3.Database,
  tables: string[],
) {
  for (const table of tables) {
    await copyTable(source, destination, table);
  }
}

async function copyTable(
  source: sqlite3.Database,
  destination: sqlite3.Database,
  table: string,
) {
  const rows = await getRows(source, table);
  for (const row of rows) {
    await insertRow(destination, table, row);
  }
}

function getRows(db: sqlite3.Database, table: string) {
  return new Promise<Row[]>((resolve, reject) => {
    db.all(`SELECT * FROM ${table}`, (error, rows: Row[]) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

function insertRow(db: sqlite3.Database, table: string, row: Row) {
  const columns = Object.keys(row).join(', ');
  const values = Object.values(row)
    .map((value) => `${safeValue(value)}`)
    .join(', ');
  return new Promise<void>((resolve, reject) => {
    db.run(`INSERT INTO ${table} (${columns}) VALUES (${values})`, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function safeValue(value: unknown) {
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  }
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'object') {
    return safeValue(JSON.stringify(value));
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  throw new Error(`Unsupported value type: ${typeof value}`);
}
