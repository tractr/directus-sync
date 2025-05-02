import {
  Context,
  createOneItemInEachSystemCollection,
  debug,
  getDumpedSystemCollectionsContents,
  getSystemCollectionsNames,
  info,
} from '../helpers/index.js';

export const noCollections = (context: Context) => {
  it('should not pull any collections when using --no-collections', async () => {
    // Init sync client
    const sync = await context.getSync('temp/no-collections');
    const directus = context.getDirectus();

    const systemCollections = getSystemCollectionsNames();

    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
    await createOneItemInEachSystemCollection(client);

    // --------------------------------------------------------------------
    // Pull the content from Directus with --no-collections
    const output = await sync.pull(['--no-collections']);

    // --------------------------------------------------------------------
    // Check if the logs does not report any content being pulled
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

  it('should not push any collections when using --no-collections', async () => {
    // Init sync client
    const sync = await context.getSync('sources/one-item-per-collection');
    const directus = context.getDirectus();
    const systemCollections = getSystemCollectionsNames();

    // --------------------------------------------------------------------
    // Push the data to Directus with --no-collections
    const beforePushDate = new Date();
    const output = await sync.push(['--no-collections']);

    // --------------------------------------------------------------------
    // Check if the logs does not report any content being pushed
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
      expect(created.length)
        .withContext(collection)
        .toBe(0);
    }
  });
}; 