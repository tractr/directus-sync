import {
  DirectusInstance,
  DirectusSync,
  getDumpedSystemCollectionsContents,
  getSetupTimeout,
  getSystemCollectionsNames,
  SystemCollection,
} from './sdk';
import Path from 'path';
import { rmSync } from 'fs-extra';
import { readAllSystemCollections } from './utils';

describe('Pull, diff and push without data', () => {
  const dumpPath = Path.resolve(__dirname, 'dumps/empty');
  const instance = new DirectusInstance();
  const directus = instance.getDirectusClient();
  let sync: DirectusSync;

  beforeAll(async () => {
    rmSync(dumpPath, { recursive: true, force: true });
    await instance.start();
    await directus.loginAsAdmin();
    sync = new DirectusSync({
      token: await directus.requireToken(),
      url: directus.getUrl(),
      dumpPath: dumpPath,
    });
  }, getSetupTimeout());
  afterAll(() => {
    instance.stop();
  });

  it('should pull even if nothing custom in Directus', async () => {
    const output = await sync.pull();
    expect(output).toContain('Done');

    const collections = getDumpedSystemCollectionsContents(dumpPath);
    const keys = Object.keys(collections) as SystemCollection[];
    expect(keys).toEqual([
      'dashboards',
      'flows',
      'folders',
      'operations',
      'panels',
      'permissions',
      'presets',
      'roles',
      'settings',
      'translations',
      'webhooks',
    ]);

    keys.forEach((key) => {
      expect(collections[key]).toEqual([]);
    });
  });

  it('should not create any entries in Directus', async () => {
    await sync.pull();
    const client = directus.get();
    const all = await readAllSystemCollections(client);
    const keys = Object.keys(all) as SystemCollection[];
    keys.forEach((key) => {
      expect(all[key]).toEqual([]);
    });
  });

  it('should not see any diff if nothing is created', async () => {
    await sync.pull();
    const output = await sync.diff();

    expect(output).toContain('[snapshot] No changes to apply');

    const collections = getSystemCollectionsNames();

    for (const collection of collections) {
      expect(output).toContain(`[${collection}] Dangling id maps: 0 item(s)`);
      expect(output).toContain(`[${collection}] To create: 0 item(s)`);
      expect(output).toContain(`[${collection}] To update: 0 item(s)`);
      expect(output).toContain(`[${collection}] To delete: 0 item(s)`);
      expect(output).toContain(`[${collection}] Unchanged: 0 item(s)`);
    }
  });

  it('should not create any entries in Directus on push', async () => {
    await sync.pull();
    await sync.push();
    const client = directus.get();
    const all = await readAllSystemCollections(client);
    const keys = Object.keys(all) as SystemCollection[];
    keys.forEach((key) => {
      expect(all[key]).toEqual([]);
    });
  });
});
