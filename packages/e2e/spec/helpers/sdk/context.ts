import { DirectusInstance } from './directus-instance.js';
import Path from 'path';
import fs from 'fs-extra';
import { DirectusSync } from './directus-sync.js';
import { SqliteClient } from './sqlite-client.js';
import { sleep } from './async/index.js';
import { DirectusSyncArgs } from './interfaces';

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
    await this.directus.clearCache();
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

  async getSync(
    dumpFolder: string,
    configPath?: string,
    factory: new (options: DirectusSyncArgs) => DirectusSync = DirectusSync,
  ): Promise<DirectusSync> {
    const dumpPath = Path.resolve(dumpBaseDirectory, dumpFolder);
    const seedPath = Path.resolve(dumpPath, 'seed');
    const clearDumpPath = dumpFolder.startsWith('temp');
    if (clearDumpPath) {
      fs.rmSync(dumpPath, { recursive: true, force: true });
    }
    const directus = this.getDirectus();
    const instance = this.getInstance();
    const options = {
      token: await directus.requireToken(),
      url: instance.getUrl(),
      dumpPath,
      seedPath,
      configPath: configPath
        ? Path.resolve(configBaseDirectory, configPath)
        : undefined,
    };
    return new factory(options);
  }
}
