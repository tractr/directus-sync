import {
  Context,
  createOneItemInEachSystemCollection,
  debug,
  deleteItemsFromSystemCollections,
  getDefaultItemsCount,
  getDumpedSystemCollectionsContents,
  getSystemCollectionsNames,
} from '../helpers/index.js';

export const pullWithNewData = (context: Context) => {
  it('should override previous pulled data', async () => {
    // Init sync client
    const sync = await context.getSync('temp/pull-with-new-data');
    const directus = context.getDirectus();

    const systemCollections = getSystemCollectionsNames();

    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
    const firstBatch = await createOneItemInEachSystemCollection(client);

    // --------------------------------------------------------------------
    // Pull the content from Directus and save results
    await sync.pull();
    const firstCollections = getDumpedSystemCollectionsContents(
      sync.getDumpPath(),
    );

    // --------------------------------------------------------------------
    // Delete the content
    await deleteItemsFromSystemCollections(client, {
      dashboards: [firstBatch.dashboard.id],
      flows: [firstBatch.flow.id],
      folders: [firstBatch.folder.id],
      operations: [firstBatch.operation.id],
      panels: [firstBatch.panel.id],
      roles: [firstBatch.role.id],
      policies: [firstBatch.policy.id],
      permissions: [firstBatch.permission.id],
      presets: [firstBatch.preset.id],
      translations: [firstBatch.translation.id],
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
      const count = 1 + getDefaultItemsCount(collection);
      expect(output).toContain(debug(`[${collection}] Pulled ${count} items.`));
      expect(output).toContain(
        debug(`[${collection}] Post-processed ${count} items.`),
      );
    }

    // --------------------------------------------------------------------
    // Check created sync id
    // TODO: Should be 1, but for instance the `pull` command doest not clean the dangling sync id maps
    for (const collection of systemCollections) {
      const count =
        (collection === 'settings' ? 1 : 2) + getDefaultItemsCount(collection);
      expect((await directus.getSyncIdMaps(collection)).length).toBe(count);
    }

    // --------------------------------------------------------------------
    // Check if the content was dumped correctly
    const secondCollections = getDumpedSystemCollectionsContents(
      sync.getDumpPath(),
    );

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
    expect(firstCollections.policies).not.toEqual(secondCollections.policies);
    expect(firstCollections.permissions).not.toEqual(
      secondCollections.permissions,
    );
    expect(firstCollections.presets).not.toEqual(secondCollections.presets);
    expect(firstCollections.settings).not.toEqual(secondCollections.settings);
    expect(firstCollections.translations).not.toEqual(
      secondCollections.translations,
    );
  });
};
