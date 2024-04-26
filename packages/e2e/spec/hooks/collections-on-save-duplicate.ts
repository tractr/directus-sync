import {
  Context,
  createOneItemInEachSystemCollection,
  getDumpedSystemCollectionsContents,
} from '../helpers/index.js';

export const collectionsOnSaveDuplicate = (context: Context) => {
  it('can duplicate data on saving and dumping', async () => {
    // Init sync client
    const sync = await context.getSync(
      'temp/on-save-duplicate',
      true,
      'on-save-duplicate/directus-sync.config.cjs',
    );
    const directus = context.getDirectus();

    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
    await createOneItemInEachSystemCollection(client);
    await sync.pull();

    // --------------------------------------------------------------------
    // Check if the content was changed correctly
    const collections = getDumpedSystemCollectionsContents(sync.getDumpPath());

    for (const [collection, items] of Object.entries(collections)) {
      expect(items.length).withContext(collection).toEqual(4);
    }
  });
};
