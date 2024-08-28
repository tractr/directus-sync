import {
  Context,
  getDefaultItemsCount,
  getSystemCollectionsNames,
  info,
  readAllSystemCollections,
} from '../helpers/index.js';

export const pullAndPushWithDeletions = (context: Context) => {
  it('should detect and apply deletions', async () => {
    // Init sync client
    const syncInit = await context.getSync(
      'sources/one-item-per-collection',
      false,
    );
    const directus = context.getDirectus();
    const client = directus.get();

    // Populate the instance with synced data
    await syncInit.push();

    // Push empty to Directus
    const sync = await context.getSync('sources/empty-collections', false);
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
        info(`[${collection}] To delete: 1 item(s)`),
      );
      expect(diffOutput).toContain(
        info(
          `[${collection}] Unchanged: ${getDefaultItemsCount(collection)} item(s)`,
        ),
      );
    }

    // Push the data back to Directus
    const pushOutput = await sync.push();

    // Ensure that no activities were created
    const data = await readAllSystemCollections(client);
    for (const collection of collections) {
      const count = collection === 'settings' ? 1 : 0;
      expect(data[collection].length).withContext(collection).toEqual(count);
    }

    // Analyze the output
    // Operations are deleted with the flows (cascade)
    // Panels are deleted with the dashboards (cascade)
    // Permissions are deleted with the presets (cascade)
    // Settings is not deleted
    const expectCount = (collection: string) =>
      ['operations', 'panels', 'permissions', 'settings'].includes(collection)
        ? 0
        : 1;

    expect(pushOutput).toContain(info('[snapshot] No changes to apply'));
    for (const collection of collections) {
      expect(pushOutput)
        .withContext(collection)
        .toContain(info(`[${collection}] Deleted 0 dangling items`));
      expect(pushOutput)
        .withContext(collection)
        .toContain(info(`[${collection}] Created 0 items`));
      expect(pushOutput)
        .withContext(collection)
        .toContain(info(`[${collection}] Updated 0 items`));
      if (collection !== 'settings') {
        expect(pushOutput)
          .withContext(collection)
          .toContain(
            info(`[${collection}] Deleted ${expectCount(collection)} items`),
          );
      }

      // Nothing created, updated or deleted
      expect(pushOutput).not.toContain(info(`[${collection}] Created 1 items`));
      expect(pushOutput).not.toContain(info(`[${collection}] Updated 1 items`));
    }

    // --------------------------------------------------------------------
    // Check deleted sync id
    // Todo: Should clean up the sync id maps for cascading deletion
    for (const collection of collections) {
      expect((await directus.getSyncIdMaps(collection)).length)
        .withContext(collection)
        .toBe(
          (expectCount(collection) ? 0 : 1) + getDefaultItemsCount(collection),
        );
    }
  });
};
