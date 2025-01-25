import {
  Context,
  debug,
  getDefaultItemsCount,
  getSystemCollectionsNames,
  info,
} from '../helpers/index.js';

export const pushOnEmptyInstance = (context: Context) => {
  it('diff and push on an empty instance', async () => {
    // Init sync client
    const sync = await context.getSync('sources/one-item-per-collection');
    const directus = context.getDirectus();
    const collections = getSystemCollectionsNames();

    const diffOutput = await sync.diff();
    expect(diffOutput).toContain(debug('[snapshot] No changes to apply'));

    for (const collection of collections) {
      expect(diffOutput).toContain(
        debug(`[${collection}] Dangling id maps: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        info(`[${collection}] To create: 1 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] To update: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] To delete: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(
          `[${collection}] Unchanged: ${getDefaultItemsCount(collection)} item(s)`,
        ),
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
          a.action === 'create' && a.collection === `directus_${collection}`,
      );
      expect(created.length).withContext(collection).toEqual(1);
    }

    // Analyze the output
    expect(pushOutput).toContain(debug('[snapshot] No changes to apply'));
    for (const collection of collections) {
      expect(pushOutput).toContain(
        debug(`[${collection}] Deleted 0 dangling items`),
      );
      expect(pushOutput).toContain(info(`[${collection}] Created 1 items`));
      expect(pushOutput).toContain(debug(`[${collection}] Updated 0 items`));
      if (collection !== 'settings') {
        expect(pushOutput).toContain(debug(`[${collection}] Deleted 0 items`));
      }

      // Nothing deleted
      expect(pushOutput).not.toContain(info(`[${collection}] Deleted 1 items`));
    }
  });
};
