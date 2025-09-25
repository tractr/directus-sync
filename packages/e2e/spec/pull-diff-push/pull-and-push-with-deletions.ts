import {
  Context,
  debug,
  getDefaultItemsCount,
  getSystemCollectionsNames,
  info,
  isSingletonCollectionWithDefault,
  readAllSystemCollections,
} from '../helpers/index.js';

export const pullAndPushWithDeletions = (context: Context) => {
  it('should detect and apply deletions', async () => {
    // Init sync client
    const syncInit = await context.getSync('sources/one-item-per-collection');
    const directus = context.getDirectus();
    const client = directus.get();

    // Populate the instance with synced data
    await syncInit.push();

    // Push empty to Directus
    const sync = await context.getSync('sources/empty-collections');
    const collections = getSystemCollectionsNames();

    const diffOutput = await sync.diff();
    expect(diffOutput).toContain(debug('[snapshot] No changes to apply'));

    for (const collection of collections) {
      const isSingleton = isSingletonCollectionWithDefault(collection);
      const updated = isSingleton ? 1 : 0;
      const deleted = isSingleton ? 0 : 1;
      const unchanged = getDefaultItemsCount(collection);

      expect(diffOutput).toContain(
        debug(`[${collection}] Dangling id maps: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] To create: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        (updated ? info : debug)(
          `[${collection}] To update: ${updated} item(s)`,
        ),
      );
      expect(diffOutput).toContain(
        (deleted ? info : debug)(
          `[${collection}] To delete: ${deleted} item(s)`,
        ),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] Unchanged: ${unchanged} item(s)`),
      );
    }

    // Push the data back to Directus
    const pushOutput = await sync.push();

    // Ensure that no activities were created
    const data = await readAllSystemCollections(client);
    for (const collection of collections) {
      expect(data[collection].length).withContext(collection).toEqual(0);
    }

    // Analyze the output
    // Operations are deleted with the flows (cascade)
    // Panels are deleted with the dashboards (cascade)
    // Permissions are deleted with the policies (cascade)
    // Settings is not deleted
    const expectCount = (collection: string) =>
      ['operations', 'panels', 'permissions', 'settings'].includes(collection)
        ? 0
        : 1;

    expect(pushOutput).toContain(debug('[snapshot] No changes to apply'));
    for (const collection of collections) {
      const isSingleton = isSingletonCollectionWithDefault(collection);
      const updated = isSingleton ? 1 : 0;
      const deleted = expectCount(collection);

      expect(pushOutput)
        .withContext(collection)
        .toContain(debug(`[${collection}] Deleted 0 dangling items`));
      expect(pushOutput)
        .withContext(collection)
        .toContain(debug(`[${collection}] Created 0 items`));
      expect(pushOutput)
        .withContext(collection)
        .toContain(
          (updated ? info : debug)(`[${collection}] Updated ${updated} items`),
        );

      // No deletion for settings
      if (collection !== 'settings') {
        expect(pushOutput)
          .withContext(collection)
          .toContain(
            (deleted ? info : debug)(
              `[${collection}] Deleted ${deleted} items`,
            ),
          );
      }

      // Nothing created, updated or deleted
      expect(pushOutput).not.toContain(info(`[${collection}] Created 1 items`));
      if (collection !== 'settings') {
        expect(pushOutput).not.toContain(
          info(`[${collection}] Updated 1 items`),
        );
      }
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
