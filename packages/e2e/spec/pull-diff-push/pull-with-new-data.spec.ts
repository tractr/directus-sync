import {
  debug,
  DirectusInstance,
  DirectusSync,
  getDumpedSystemCollectionsContents,
  getSystemCollectionsNames,
} from '../helpers/sdk/index.js';
import Path from 'path';
import fs from 'fs-extra';
import {
  createOneItemInEachSystemCollection,
  deleteItemsFromSystemCollections,
} from '../helpers/utils/index.js';

describe('Pull 2 times from an instance', () => {
  const dumpPath = Path.resolve('dumps', 'pull-with-new-data');
  const instance = new DirectusInstance();
  const directus = instance.getDirectusClient();
  const systemCollections = getSystemCollectionsNames();
  let sync: DirectusSync;

  beforeAll(async () => {
    fs.rmSync(dumpPath, { recursive: true, force: true });
    await instance.start();
    await directus.loginAsAdmin();
    sync = new DirectusSync({
      token: await directus.requireToken(),
      url: directus.getUrl(),
      dumpPath: dumpPath,
    });
  });
  afterAll(() => {
    instance.stop();
  });

  it('should override previous pulled data', async () => {
    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
    const firstBatch = await createOneItemInEachSystemCollection(client);

    // --------------------------------------------------------------------
    // Pull the content from Directus and save results
    await sync.pull();
    const firstCollections = getDumpedSystemCollectionsContents(dumpPath);

    // --------------------------------------------------------------------
    // Delete the content
    await deleteItemsFromSystemCollections(client, {
      dashboards: [firstBatch.dashboard.id],
      flows: [firstBatch.flow.id],
      folders: [firstBatch.folder.id],
      operations: [firstBatch.operation.id],
      panels: [firstBatch.panel.id],
      roles: [firstBatch.role.id],
      permissions: [firstBatch.permission.id],
      presets: [firstBatch.preset.id],
      translations: [firstBatch.translation.id],
      webhooks: [firstBatch.webhook.id],
    });

    // --------------------------------------------------------------------
    // Create new content
    await createOneItemInEachSystemCollection(client);

    // --------------------------------------------------------------------
    // Pull the content from Directus
    const output = await sync.pull();

    // --------------------------------------------------------------------
    // Check if the logs reports new content
    for (const collection of systemCollections) {
      expect(output).toContain(debug(`[${collection}] Pulled 1 items.`));
      expect(output).toContain(
        debug(`[${collection}] Post-processed 1 items.`),
      );
    }

    // --------------------------------------------------------------------
    // Check created sync id
    // TODO: Should be 1, but for instance the `pull` command doest not clean the dangling sync id maps
    for (const collection of systemCollections) {
      expect((await directus.getSyncIdMaps(collection)).length).toBe(
        collection === 'settings' ? 1 : 2,
      );
    }

    // --------------------------------------------------------------------
    // Check if the content was dumped correctly
    const secondCollections = getDumpedSystemCollectionsContents(dumpPath);

    expect(firstCollections.dashboards).not.toEqual(
      secondCollections.dashboards,
    );
    expect(firstCollections.flows).not.toEqual(secondCollections.flows);
    expect(firstCollections.folders).not.toEqual(secondCollections.folders);
    expect(firstCollections.operations).not.toEqual(
      secondCollections.operations,
    );
    expect(firstCollections.panels).not.toEqual(secondCollections.panels);
    expect(firstCollections.roles).not.toEqual(secondCollections.roles);
    expect(firstCollections.permissions).not.toEqual(
      secondCollections.permissions,
    );
    expect(firstCollections.presets).not.toEqual(secondCollections.presets);
    expect(firstCollections.settings).not.toEqual(secondCollections.settings);
    expect(firstCollections.translations).not.toEqual(
      secondCollections.translations,
    );
    expect(firstCollections.webhooks).not.toEqual(secondCollections.webhooks);
  });
});
