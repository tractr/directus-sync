import {
  Context,
  getSystemCollectionsNames,
  info,
  createOneItemInEachSystemCollection,
} from '../helpers/index.js';

export const pullAndPushWithoutChanges = (context: Context) => {
  it('no diff if no changes and no mutations on push', async () => {
    // Init sync client
    const sync = await context.getSync('temp/pull-and-push-without-changes');
    const directus = context.getDirectus();

    // Populate the instance with some data and pull them
    await createOneItemInEachSystemCollection(directus.get());
    await sync.pull();
    const collections = getSystemCollectionsNames();

    const diffOutput = await sync.diff();
    expect(diffOutput).toContain(info('[snapshot] No changes to apply'));

    for (const collection of collections) {
      expect(diffOutput).toContain(
        info(`[${collection}] Dangling id maps: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        info(`[${collection}] To create: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        info(`[${collection}] To update: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        info(`[${collection}] To delete: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        info(`[${collection}] Unchanged: 1 item(s)`),
      );
    }

    // Push the data back to Directus
    const beforePushDate = new Date();
    const pushOutput = await sync.push();

    // Ensure that no activities were created
    const activities = await directus.getActivities(beforePushDate);
    expect(activities.filter((a) => a.action === 'create')).toEqual([]);
    expect(activities.filter((a) => a.action === 'update')).toEqual([]);
    expect(activities.filter((a) => a.action === 'delete')).toEqual([]);

    // Analyze the output
    expect(pushOutput).toContain(info('[snapshot] No changes to apply'));
    for (const collection of collections) {
      expect(pushOutput).toContain(
        info(`[${collection}] Deleted 0 dangling items`),
      );
      expect(pushOutput).toContain(info(`[${collection}] Created 0 items`));
      expect(pushOutput).toContain(info(`[${collection}] Updated 0 items`));
      if (collection !== 'settings') {
        expect(pushOutput).toContain(info(`[${collection}] Deleted 0 items`));
      }

      // Nothing created, updated or deleted
      expect(pushOutput).not.toContain(info(`[${collection}] Created 1 items`));
      expect(pushOutput).not.toContain(info(`[${collection}] Updated 1 items`));
      expect(pushOutput).not.toContain(info(`[${collection}] Deleted 1 items`));
    }
  });
};
