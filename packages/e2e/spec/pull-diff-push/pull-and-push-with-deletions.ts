import {
  Context,
  debug,
  getDefaultItemsCount,
  getSystemCollectionsNames,
  info,
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
      expect(diffOutput).toContain(
        debug(`[${collection}] Dangling id maps: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] To create: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] To update: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        info(`[${collection}] To delete: 1 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(
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
    // Permissions are deleted with the policies (cascade)
    // Settings is not deleted
    const expectCount = (collection: string) =>
      ['operations', 'panels', 'permissions', 'settings'].includes(collection)
        ? 0
        : 1;

    expect(pushOutput).toContain(debug('[snapshot] No changes to apply'));
    for (const collection of collections) {
      expect(pushOutput)
        .withContext(collection)
        .toContain(debug(`[${collection}] Deleted 0 dangling items`));
      expect(pushOutput)
        .withContext(collection)
        .toContain(debug(`[${collection}] Created 0 items`));
      expect(pushOutput)
        .withContext(collection)
        .toContain(debug(`[${collection}] Updated 0 items`));
      if (collection !== 'settings') {
        const amount = expectCount(collection);
        expect(pushOutput)
          .withContext(collection)
          .toContain(
            (amount ? info : debug)(`[${collection}] Deleted ${amount} items`),
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
