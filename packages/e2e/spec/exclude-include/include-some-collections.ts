import {
  Context,
  debug,
  getDumpedSystemCollectionsContents,
  getSystemCollectionsNames,
  createOneItemInEachSystemCollection,
  info,
  SystemCollection,
} from '../helpers/index.js';

export const includeSomeCollections = (context: Context) => {
  it('should be able to select collection during pull', async () => {
    // Init sync client
    const sync = await context.getSync('temp/include-some-collections');
    const directus = context.getDirectus();

    const systemCollections = getSystemCollectionsNames();

    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
    await createOneItemInEachSystemCollection(client);

    // --------------------------------------------------------------------
    // Pull the content from Directus
    const collectionsToInclude: SystemCollection[] = [
      'roles',
      'permissions',
      'translations',
    ];
    const excludedCollections = systemCollections.filter(
      (collection) => !collectionsToInclude.includes(collection),
    );
    const output = await sync.pull([
      `--only-collections=${collectionsToInclude.join(', ')}`,
    ]);

    // --------------------------------------------------------------------
    // Check if the logs report new content correctly
    for (const collection of excludedCollections) {
      expect(output)
        .withContext(collection)
        .not.toContain(debug(`[${collection}] Pulled 0 items.`));
      expect(output)
        .withContext(collection)
        .not.toContain(debug(`[${collection}] Pulled 1 items.`));
    }
    for (const collection of collectionsToInclude) {
      expect(output)
        .withContext(collection)
        .toContain(debug(`[${collection}] Pulled 1 items.`));
      expect(output)
        .withContext(collection)
        .toContain(debug(`[${collection}] Post-processed 1 items.`));
    }

    // --------------------------------------------------------------------
    // Check created sync id
    const expectCount = (collection: SystemCollection) => {
      return excludedCollections.includes(collection) ? 0 : 1;
    };
    for (const collection of systemCollections) {
      expect((await directus.getSyncIdMaps(collection)).length)
        .withContext(collection)
        .toBe(expectCount(collection));
    }

    // --------------------------------------------------------------------
    // Check if the content was included correctly
    const collections = getDumpedSystemCollectionsContents(sync.getDumpPath());
    for (const collection of systemCollections) {
      if (excludedCollections.includes(collection)) {
        expect(collections[collection]).withContext(collection).toBeUndefined();
      } else {
        expect(collections[collection]).withContext(collection).toBeDefined();
      }
    }
  });

  it('should be able to select collection during push', async () => {
    // Init sync client
    const sync = await context.getSync(
      'sources/one-item-per-collection',
      false,
    );
    const directus = context.getDirectus();
    const systemCollections = getSystemCollectionsNames();

    // --------------------------------------------------------------------
    // Push the data to Directus and trigger a ping in order to detect the end of the push
    const beforePushDate = new Date();
    const collectionsToInclude = ['roles', 'permissions', 'translations'];
    const excludedCollections = systemCollections.filter(
      (collection) => !collectionsToInclude.includes(collection),
    );
    const output = await sync.push([
      `--only-collections=${collectionsToInclude.join(', ')}`,
    ]);

    // --------------------------------------------------------------------
    // Check if the logs does not report new content
    for (const collection of excludedCollections) {
      expect(output)
        .withContext(collection)
        .not.toContain(info(`[${collection}] Created 1 items`));
      expect(output)
        .withContext(collection)
        .not.toContain(info(`[${collection}] Created 0 items`));
    }
    for (const collection of collectionsToInclude) {
      expect(output)
        .withContext(collection)
        .toContain(info(`[${collection}] Created 1 items`));
    }

    // --------------------------------------------------------------------
    // Ensure that activities were created or not
    const activities = await directus.getActivities(beforePushDate);
    const expectCount = (collection: SystemCollection) => {
      // No activities for presets
      return ['presets', ...excludedCollections].includes(collection) ? 0 : 1;
    };
    for (const collection of systemCollections) {
      const created = activities.filter(
        (a) =>
          a.action === 'create' && a.collection === `directus_${collection}`,
      );
      expect(created.length)
        .withContext(collection)
        .toEqual(expectCount(collection));
    }
  });
};
