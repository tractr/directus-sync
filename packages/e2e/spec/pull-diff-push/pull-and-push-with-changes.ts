import {
  Context,
  debug,
  getDefaultItemsCount,
  getSystemCollectionsNames,
  info,
} from '../helpers/index.js';

export const pullAndPushWithChanges = (context: Context) => {
  it('diff if mutations on push', async () => {
    // --------------------------------------------------------------------
    // Init sync client and push
    const syncInit = await context.getSync('sources/one-item-per-collection');
    const directus = context.getDirectus();
    await syncInit.push();

    // Create another sync client from the updated dump
    const sync = await context.getSync(
      'sources/one-item-per-collection-updated',
    );
    const collections = getSystemCollectionsNames();

    // --------------------------------------------------------------------
    const diffOutput = await sync.diff();
    expect(diffOutput).toContain(debug('[snapshot] No changes to apply'));

    for (const collection of collections) {
      expect(diffOutput).toContain(
        debug(`[${collection}] Dangling id maps: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] To create: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        info(`[${collection}] To update: 1 item(s)`),
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

    // --------------------------------------------------------------------
    // Push the data back to Directus
    const beforePushDate = new Date();
    const pushOutput = await sync.push();

    // Ensure that no activities were created
    const activities = await directus.getActivities(beforePushDate);
    expect(activities.filter((a) => a.action === 'create')).toEqual([]);
    expect(activities.filter((a) => a.action === 'delete')).toEqual([]);
    const expectCount = (collection: string) => {
      if (collection === 'presets') {
        return 0;
      }
      if (collection === 'translations') {
        return 2; // updated in 2 steps
      }
      return 1;
    };
    for (const collection of collections) {
      const updated = activities.filter(
        (a) =>
          a.action === 'update' && a.collection === `directus_${collection}`,
      );
      expect(updated.length)
        .withContext(collection)
        .toEqual(expectCount(collection));
    }

    // Analyze the output
    expect(pushOutput).toContain(debug('[snapshot] No changes to apply'));
    for (const collection of collections) {
      expect(pushOutput).toContain(
        debug(`[${collection}] Deleted 0 dangling items`),
      );
      expect(pushOutput).toContain(debug(`[${collection}] Created 0 items`));
      expect(pushOutput).toContain(info(`[${collection}] Updated 1 items`));
      if (collection !== 'settings') {
        expect(pushOutput).toContain(debug(`[${collection}] Deleted 0 items`));
      }

      // Nothing created or deleted
      expect(pushOutput).not.toContain(info(`[${collection}] Created 1 items`));
      expect(pushOutput).not.toContain(info(`[${collection}] Deleted 1 items`));
    }

    // --------------------------------------------------------------------
    // Check if the content was updated correctly
    const finalDiffOutput = await sync.diff();
    expect(finalDiffOutput).toContain(debug('[snapshot] No changes to apply'));

    for (const collection of collections) {
      expect(finalDiffOutput).toContain(
        debug(`[${collection}] Dangling id maps: 0 item(s)`),
      );
      expect(finalDiffOutput).toContain(
        debug(`[${collection}] To create: 0 item(s)`),
      );
      expect(finalDiffOutput).toContain(
        debug(`[${collection}] To update: 0 item(s)`),
      );
      expect(finalDiffOutput).toContain(
        debug(`[${collection}] To delete: 0 item(s)`),
      );
      expect(finalDiffOutput).toContain(
        debug(
          `[${collection}] Unchanged: ${getDefaultItemsCount(collection) + 1} item(s)`,
        ),
      );
    }
  });
};
