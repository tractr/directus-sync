import { DirectusInstance } from './directus-instance.js';
import Path from 'path';
import fs from 'fs-extra';
import { DirectusSync } from './directus-sync.js';
import { SqliteClient } from './sqlite-client.js';
import { sleep } from './async/index.js';

const dumpBaseDirectory = Path.resolve('dumps');
const configBaseDirectory = Path.resolve('configs');

export class Context {
  protected readonly sqlite: SqliteClient = new SqliteClient();
  protected readonly instance: DirectusInstance = new DirectusInstance();
  protected readonly directus = this.instance.getDirectusClient();

  async setup() {
    await this.sqlite.reset();
    this.directus.reset();
    await this.directus.loginAsAdmin();
  }
  async teardown() {
    // nothing to teardown
  }

  async init() {
    await this.instance.start();
  }

  async dispose() {
    this.instance.stop();
    await sleep(500);
  }

  getDirectus() {
    if (!this.directus) {
      throw new Error('Directus not initialized');
    }
    return this.directus;
  }

  getInstance() {
    if (!this.instance) {
      throw new Error('Instance not initialized');
    }
    return this.instance;
  }

  async getSync(dumpFolder: string, clearDumpPath = true, configPath?: string) {
    const dumpPath = Path.resolve(dumpBaseDirectory, dumpFolder);
    if (clearDumpPath) {
      fs.rmSync(dumpPath, { recursive: true, force: true });
    }
    const directus = this.getDirectus();
    const instance = this.getInstance();
    return new DirectusSync({
      token: await directus.requireToken(),
      url: instance.getUrl(),
      dumpPath,
      configPath: configPath ? Path.resolve(configBaseDirectory, configPath) : undefined,
    });
  }
}
