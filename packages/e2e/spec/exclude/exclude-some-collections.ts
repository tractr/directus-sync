import {
  Context,
  debug,
  getDumpedSystemCollectionsContents,
  getSystemCollectionsNames,
  createOneItemInEachSystemCollection,
} from '../helpers/index.js';

export const excludeSomeCollections = (context: Context) => {
  it('should be able to ignore few collection during pull', async () => {
    // Init sync client
    const sync = await context.getSync('temp/exclude-some-collections');
    const directus = context.getDirectus();

    const systemCollections = getSystemCollectionsNames();

    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
    await createOneItemInEachSystemCollection(client);

    // --------------------------------------------------------------------
    // Pull the content from Directus
    const collectionsToExclude = ['roles', 'permissions', 'translations'];
    const output = await sync.pull([
      `--exclude-collections=${collectionsToExclude.join(', ')}`,
    ]);

    // --------------------------------------------------------------------
    // Check if the logs does not report new content
    for (const collection of collectionsToExclude) {
      expect(output)
        .withContext(collection)
        .not.toContain(debug(`[${collection}] Pulled 0 items.`));
      expect(output)
        .withContext(collection)
        .not.toContain(debug(`[${collection}] Pulled 1 items.`));
    }

    // --------------------------------------------------------------------
    // Check created sync id
    const expectCount = (collection: string) => {
      return collectionsToExclude.includes(collection) ? 0 : 1;
    };
    for (const collection of systemCollections) {
      expect((await directus.getSyncIdMaps(collection)).length)
        .withContext(collection)
        .toBe(expectCount(collection));
    }

    // --------------------------------------------------------------------
    // Check if the content was excluded correctly
    const collections = getDumpedSystemCollectionsContents(sync.getDumpPath());
    for (const collection of systemCollections) {
      if (collectionsToExclude.includes(collection)) {
        expect(collections[collection]).withContext(collection).toBeUndefined();
      } else {
        expect(collections[collection]).withContext(collection).toBeDefined();
      }
    }
  });
};
