import {
  Context,
  createOneItemInEachSystemCollection,
  debug,
  getDumpedSystemCollectionsContents,
  getSystemCollectionsNames,
  info,
} from '../helpers/index.js';

export const noCollectionsConfigFile = (context: Context) => {
  it('should not pull any collections when collections: false is set in the config file', async () => {
    // Init sync client with a config file that disables collections
    const sync = await context.getSync(
      'temp/no-collections-config-file',
      'no-collections-config-file/directus-sync.config.cjs',
    );
    const directus = context.getDirectus();

    const systemCollections = getSystemCollectionsNames();

    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
    await createOneItemInEachSystemCollection(client);

    // --------------------------------------------------------------------
    // Pull the content from Directus (no CLI flag, only config file)
    const output = await sync.pull();

    // --------------------------------------------------------------------
    // Check if the logs do not report any content being pulled
    for (const collection of systemCollections) {
      expect(output)
        .withContext(collection)
        .not.toContain(debug(`[${collection}] Pulled 0 items.`));
      expect(output)
        .withContext(collection)
        .not.toContain(debug(`[${collection}] Pulled 1 items.`));
    }

    // --------------------------------------------------------------------
    // Check that no sync IDs were created
    for (const collection of systemCollections) {
      expect((await directus.getSyncIdMaps(collection)).length)
        .withContext(collection)
        .toBe(0);
    }

    // --------------------------------------------------------------------
    // Check that no collections were dumped
    const collections = getDumpedSystemCollectionsContents(sync.getDumpPath());
    for (const collection of systemCollections) {
      expect(collections[collection]).withContext(collection).toBeUndefined();
    }
  });

  it('should not push any collections when collections: false is set in the config file', async () => {
    // Init sync client with a config file that disables collections
    const sync = await context.getSync(
      'sources/one-item-per-collection',
      'no-collections-config-file/directus-sync.config.cjs',
    );
    const directus = context.getDirectus();
    const systemCollections = getSystemCollectionsNames();

    // --------------------------------------------------------------------
    // Push the data to Directus (no CLI flag, only config file)
    const beforePushDate = new Date();
    const output = await sync.push();

    // --------------------------------------------------------------------
    // Check if the logs do not report any content being pushed
    for (const collection of systemCollections) {
      expect(output)
        .withContext(collection)
        .not.toContain(info(`[${collection}] Created 1 items`));
      expect(output)
        .withContext(collection)
        .not.toContain(debug(`[${collection}] Created 0 items`));
    }

    // --------------------------------------------------------------------
    // Ensure that no activities were created
    const activities = await directus.getActivities(beforePushDate);
    for (const collection of systemCollections) {
      const created = activities.filter(
        (a) =>
          a.action === 'create' && a.collection === `directus_${collection}`,
      );
      expect(created.length).withContext(collection).toBe(0);
    }
  });
};
