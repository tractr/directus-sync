import {
  DirectusInstance,
  DirectusSync,
  getDumpedSystemCollectionsContents,
  getSetupTimeout,
} from './sdk';
import Path from 'path';
import { rmSync } from 'fs-extra';
import { createDashboard } from '@directus/sdk';

describe('Empty instance configs', () => {
  const dumpPath = Path.resolve(__dirname, 'dumps/basic');
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

  it('should pull items from Directus', async () => {
    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
    const dashboard = await client.request(
      createDashboard({
        name: 'Test dashboard',
        icon: 'groups',
        note: 'This is a test dashboard',
        color: '#FF0000',
      }),
    );

    // --------------------------------------------------------------------
    // Pull the content from Directus
    const output = await sync.pull();

    // --------------------------------------------------------------------
    // Check if the logs reports new content
    expect(output).toContain('[dashboards] Pulled 1 items');
    expect(output).toContain('[dashboards] Post-processed 1 items');

    // --------------------------------------------------------------------
    // Check created sync id
    expect((await directus.getSyncIdMaps('dashboards')).length).toBe(1);

    // --------------------------------------------------------------------
    // Check if the content was dumped correctly
    const collections = getDumpedSystemCollectionsContents(dumpPath);
    expect(collections.dashboards).toEqual([
      {
        _syncId: (await directus.getByLocalId('dashboards', dashboard.id))
          .sync_id,
        name: 'Test dashboard',
        icon: 'groups',
        note: 'This is a test dashboard',
        color: '#FF0000',
      },
    ]);
  });
});
