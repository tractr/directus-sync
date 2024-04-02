import {
  CollectionsRecord,
  DirectusInstance,
  DirectusSync,
  DumpedCollection,
  getCollectionsContents,
  getSetupTimeout,
  notAdministratorRoles,
  notNullId,
  notSystemPermissions,
} from './sdk';
import Path from 'path';
import { rmSync } from 'fs-extra';
import {
  readDashboards,
  readFlows,
  readFolders,
  readOperations,
  readPanels,
  readPermissions,
  readPresets,
  readRoles,
  readSettings,
  readTranslations,
  readWebhooks,
} from '@directus/sdk';

describe('Pull configs', () => {
  const dumpPath = Path.resolve(__dirname, 'dumps/empty');
  const instance = new DirectusInstance('sample-test');
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
  }, getSetupTimeout());

  it('should pull even if nothing custom in Directus', async () => {
    const output = await sync.pull();
    expect(output.stderr).toBe('');
    expect(output.stdout).toContain('Done');

    const collections = getCollectionsContents(dumpPath);
    const keys = Object.keys(collections) as DumpedCollection[];
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

    const all: CollectionsRecord<unknown[]> = {
      dashboards: await client.request(readDashboards()),
      flows: await client.request(readFlows()),
      folders: await client.request(readFolders()),
      operations: await client.request(readOperations()),
      panels: await client.request(readPanels()),
      permissions: (await client.request(readPermissions())).filter(
        notSystemPermissions,
      ),
      presets: await client.request(readPresets()),
      roles: (await client.request(readRoles())).filter(notAdministratorRoles),
      settings: [await client.request(readSettings())].filter(notNullId),
      translations: await client.request(readTranslations()),
      webhooks: await client.request(readWebhooks()),
    };

    const keys = Object.keys(all) as DumpedCollection[];
    keys.forEach((key) => {
      expect(all[key]).toEqual([]);
    });
  });
});
