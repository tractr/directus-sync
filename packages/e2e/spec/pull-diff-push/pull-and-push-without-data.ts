import {
  Context,
  getDefaultItemsCount,
  getDumpedSystemCollectionsContents,
  getSystemCollectionsNames,
  info,
  readAllSystemCollections,
  SystemCollection,
} from '../helpers/index.js';

export const pullAndPushWithoutData = (context: Context) => {
  it('should pull even if nothing custom in Directus', async () => {
    // Init sync client
    const sync = await context.getSync('temp/pull-and-push-without-data');

    await sync.pull();

    const collections = getDumpedSystemCollectionsContents(sync.getDumpPath());
    const keys = Object.keys(collections) as SystemCollection[];
    expect(keys).toEqual([
      'dashboards',
      'flows',
      'folders',
      'operations',
      'panels',
      'permissions',
      'policies',
      'presets',
      'roles',
      'settings',
      'translations',
    ]);

    keys.forEach((key) => {
      expect(collections[key]).toEqual([]);
    });
  });

  it('should not create any entries in Directus', async () => {
    // Init sync client
    const sync = await context.getSync('temp/pull-and-push-without-data');
    const directus = context.getDirectus();

    await sync.pull();
    const client = directus.get();
    const all = await readAllSystemCollections(client);
    const keys = Object.keys(all) as SystemCollection[];
    keys.forEach((key) => {
      expect(all[key]).toEqual([]);
    });
  });

  it('should not see any diff if nothing is created', async () => {
    // Init sync client
    const sync = await context.getSync('temp/pull-and-push-without-data');

    await sync.pull();
    const output = await sync.diff();

    expect(output).toContain(info('[snapshot] No changes to apply'));

    const collections = getSystemCollectionsNames();

    for (const collection of collections) {
      expect(output).toContain(
        info(`[${collection}] Dangling id maps: 0 item(s)`),
      );
      expect(output).toContain(info(`[${collection}] To create: 0 item(s)`));
      expect(output).toContain(info(`[${collection}] To update: 0 item(s)`));
      expect(output).toContain(info(`[${collection}] To delete: 0 item(s)`));
      expect(output).toContain(
        info(
          `[${collection}] Unchanged: ${getDefaultItemsCount(collection)} item(s)`,
        ),
      );
    }
  });

  it('should not create any entries in Directus on push', async () => {
    // Init sync client
    const sync = await context.getSync('temp/pull-and-push-without-data');
    const directus = context.getDirectus();

    await sync.pull();
    await sync.push();
    const client = directus.get();
    const all = await readAllSystemCollections(client);
    const keys = Object.keys(all) as SystemCollection[];
    keys.forEach((key) => {
      expect(all[key]).toEqual([]);
    });
  });
};
