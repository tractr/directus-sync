import {
  Context,
  getDefaultItemsCount,
  getSystemCollectionsNames,
  info,
} from '../helpers/index.js';

export const pushWithDependencies = (context: Context) => {
  it('push with operations multiple dependencies on an empty instance', async () => {
    const expectedAmount = (collection: string) => {
      if (collection === 'flows') return 1;
      if (collection === 'operations') return 3;
      return 0;
    };

    // Init sync client
    const sync = await context.getSync('sources/dependencies-operations');
    const directus = context.getDirectus();
    const collections = getSystemCollectionsNames();

    const diffOutput = await sync.diff();
    expect(diffOutput).toContain(info('[snapshot] No changes to apply'));

    for (const collection of collections) {
      expect(diffOutput).toContain(
        info(`[${collection}] Dangling id maps: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        info(
          `[${collection}] To create: ${expectedAmount(collection)} item(s)`,
        ),
      );
      expect(diffOutput).toContain(
        info(`[${collection}] To update: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        info(`[${collection}] To delete: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        info(
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
      expect(created.length)
        .withContext(collection)
        .toEqual(expectedAmount(collection));
    }

    // Analyze the output
    expect(pushOutput).toContain(info('[snapshot] No changes to apply'));
    expect(pushOutput).toContain(info('---- Push: iteration 1 ----'));
    expect(pushOutput).toContain(info('---- Push: iteration 2 ----'));
    expect(pushOutput).toContain(info('---- Push: iteration 3 ----'));
    expect(pushOutput).toContain(info('---- Push: iteration 4 ----'));
    expect(pushOutput).not.toContain(info('---- Push: iteration 5 ----'));

    for (const collection of collections) {
      expect(pushOutput).toContain(
        info(`[${collection}] Deleted 0 dangling items`),
      );
      expect(pushOutput).toContain(
        info(`[${collection}] Created ${expectedAmount(collection)} items`),
      );
      expect(pushOutput).toContain(info(`[${collection}] Updated 0 items`));
      if (collection !== 'settings') {
        expect(pushOutput).toContain(info(`[${collection}] Deleted 0 items`));
      }

      // Nothing deleted
      expect(pushOutput).not.toContain(info(`[${collection}] Deleted 1 items`));
    }
  });
};
