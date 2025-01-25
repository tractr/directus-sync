import {
  Context,
  debug,
  getSystemCollectionsNames,
  info,
} from '../helpers/index.js';

export const pushTwiceOnEmptyInstance = (context: Context) => {
  it('push twice on an empty instance', async () => {
    // Init sync client
    const sync = await context.getSync('sources/one-item-per-collection');
    const directus = context.getDirectus();
    const collections = getSystemCollectionsNames();

    // Push once to create the data
    await sync.push();

    // Push the data back to Directus
    const beforePushDate = new Date();
    const pushOutput = await sync.push();

    // Ensure that no activities were created
    const activities = await directus.getActivities(beforePushDate);
    expect(activities.filter((a) => a.action === 'create')).toEqual([]);
    expect(activities.filter((a) => a.action === 'update')).toEqual([]);
    expect(activities.filter((a) => a.action === 'delete')).toEqual([]);

    // Analyze the output
    expect(pushOutput).toContain(debug('[snapshot] No changes to apply'));
    for (const collection of collections) {
      expect(pushOutput).toContain(
        debug(`[${collection}] Deleted 0 dangling items`),
      );
      expect(pushOutput).toContain(debug(`[${collection}] Created 0 items`));
      expect(pushOutput).toContain(debug(`[${collection}] Updated 0 items`));
      if (collection !== 'settings') {
        expect(pushOutput).toContain(debug(`[${collection}] Deleted 0 items`));
      }

      // Nothing created, updated or deleted
      expect(pushOutput).not.toContain(info(`[${collection}] Created 1 items`));
      expect(pushOutput).not.toContain(info(`[${collection}] Updated 1 items`));
      expect(pushOutput).not.toContain(info(`[${collection}] Deleted 1 items`));
    }
  });
};
