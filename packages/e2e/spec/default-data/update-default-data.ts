import {
  Context,
  debug,
  getDefaultItemsCount,
  getSystemCollectionsNames,
  info,
  readAllSystemCollections,
} from '../helpers/index.js';

export const updateDefaultData = (context: Context) => {
  it('should update default entries with new values', async () => {
    // Init sync client
    const sync = await context.getSync('sources/default-updated');
    const directus = context.getDirectus();
    const client = directus.get();
    const collections = getSystemCollectionsNames();

    const diffOutput = await sync.diff();
    expect(diffOutput).toContain(debug('[snapshot] No changes to apply'));

    for (const collection of collections) {
      expect(diffOutput).toContain(
        debug(`[${collection}] Dangling id maps: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] To create: 0 item(s)`),
      );
      const amount = getDefaultItemsCount(collection);
      expect(diffOutput).toContain(
        (amount ? info : debug)(`[${collection}] To update: ${amount} item(s)`),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] To delete: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] Unchanged: 0 item(s)`),
      );
    }

    // Push the data to Directus
    const beforePushDate = new Date();
    const pushOutput = await sync.push();

    // Ensure that activities were created
    const activities = await directus.getActivities(beforePushDate);
    for (const collection of collections) {
      if (collection === 'presets') {
        // No activities for presets
        continue;
      }
      const created = activities.filter(
        (a) =>
          a.action === 'update' && a.collection === `directus_${collection}`,
      );
      expect(created.length)
        .withContext(collection)
        .toEqual(getDefaultItemsCount(collection));
    }

    // Analyze the output
    expect(pushOutput).toContain(debug('[snapshot] No changes to apply'));
    for (const collection of collections) {
      expect(pushOutput).toContain(
        debug(`[${collection}] Deleted 0 dangling items`),
      );
      expect(pushOutput).toContain(debug(`[${collection}] Created 0 items`));
      const amount = getDefaultItemsCount(collection);
      expect(pushOutput).toContain(
        (amount ? info : debug)(`[${collection}] Updated ${amount} items`),
      );
      if (collection !== 'settings') {
        expect(pushOutput).toContain(debug(`[${collection}] Deleted 0 items`));
      }

      // Nothing deleted
      expect(pushOutput).not.toContain(info(`[${collection}] Deleted 1 items`));
    }

    // Ensure that no data were duplicated
    const all = await readAllSystemCollections(client);
    for (const collection of collections) {
      const items = all[collection];
      expect(items.length)
        .withContext(collection)
        .toEqual(getDefaultItemsCount(collection));
    }
  });
};
