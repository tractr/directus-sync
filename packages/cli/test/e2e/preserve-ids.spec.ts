import {
  DirectusInstance,
  DirectusSync,
  getDumpedSystemCollectionsContents,
  getSetupTimeout,
} from './sdk';
import Path from 'path';
import { rmSync } from 'fs-extra';
import { createOneItemInEachSystemCollection } from './utils';

describe('Pull and check if ids are preserved for some collections', () => {
  const fileName = Path.basename(__filename, '.spec.ts');
  const dumpPath = Path.resolve(__dirname, 'dumps', fileName);
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

  it('should preserve some uuid from Directus', async () => {
    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
    const original = await createOneItemInEachSystemCollection(client);

    // --------------------------------------------------------------------
    // Pull the content from Directus
    await sync.pull();

    // --------------------------------------------------------------------
    // Should preserve the ids for folders and flows but not for the rest
    const collections = getDumpedSystemCollectionsContents(dumpPath);
    const getSyncId = (items: { _syncId: string }[]): string | undefined => {
      return items[0] ? items[0]._syncId : undefined;
    };

    expect(original.flow.id).toBe(getSyncId(collections.flows));
    expect(original.folder.id).toBe(getSyncId(collections.folders));

    expect(original.dashboard.id).not.toBe(getSyncId(collections.dashboards));
    expect(original.operation.id).not.toBe(getSyncId(collections.operations));
    expect(original.panel.id).not.toBe(getSyncId(collections.panels));
    expect(original.role.id).not.toBe(getSyncId(collections.roles));
    expect(original.permission.id).not.toBe(getSyncId(collections.permissions));
    expect(original.preset.id).not.toBe(getSyncId(collections.presets));
    expect(original.translation.id).not.toBe(
      getSyncId(collections.translations),
    );
    expect(original.webhook.id).not.toBe(getSyncId(collections.webhooks));
  });
});
