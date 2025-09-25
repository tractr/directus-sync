import {
  Context,
  debug,
  getDefaultItemsCount,
  getSystemCollectionsNames,
  info,
  readAllSystemCollections,
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
    expect(diffOutput).toContain(debug('[snapshot] No changes to apply'));

    for (const collection of collections) {
      expect(diffOutput).toContain(
        debug(`[${collection}] Dangling id maps: 0 item(s)`),
      );
      const amount = expectedAmount(collection);
      expect(diffOutput).toContain(
        (amount ? info : debug)(`[${collection}] To create: ${amount} item(s)`),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] To update: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(`[${collection}] To delete: 0 item(s)`),
      );
      expect(diffOutput).toContain(
        debug(
          `[${collection}] Unchanged: ${getDefaultItemsCount(collection, true)} item(s)`,
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
    expect(pushOutput).toContain(debug('[snapshot] No changes to apply'));
    expect(pushOutput).toContain(info('⬆️  Push: iteration 1'));
    expect(pushOutput).toContain(info('⬆️  Push: iteration 2'));
    expect(pushOutput).toContain(info('⬆️  Push: iteration 3'));
    expect(pushOutput).toContain(info('⬆️  Push: iteration 4'));
    expect(pushOutput).not.toContain(info('⬆️  Push: iteration 5'));

    for (const collection of collections) {
      expect(pushOutput).toContain(
        debug(`[${collection}] Deleted 0 dangling items`),
      );

      const amount = expectedAmount(collection);
      expect(pushOutput).toContain(
        (amount ? info : debug)(`[${collection}] Created ${amount} items`),
      );
      expect(pushOutput).toContain(debug(`[${collection}] Updated 0 items`));
      if (collection !== 'settings') {
        expect(pushOutput).toContain(debug(`[${collection}] Deleted 0 items`));
      }

      // Nothing deleted
      expect(pushOutput).not.toContain(info(`[${collection}] Deleted 1 items`));
    }
  });

  it('push with settings dependencies on an empty instance (folder)', async () => {
    // Init sync client
    const sync = await context.getSync(
      'sources/dependencies-settings-default-folder',
    );
    const directus = context.getDirectus();
    const client = directus.get();

    const pushOutput = await sync.push();
    expect(pushOutput).toContain(debug('[snapshot] No changes to apply'));
    expect(pushOutput).toContain(info('[folders] Created 1 items'));
    expect(pushOutput).toContain(info('[settings] Updated 1 items'));

    const { settings, folders } = await readAllSystemCollections(client);
    expect(settings.length).toEqual(1);
    expect(folders.length).toEqual(1);
    expect(settings[0]?.storage_default_folder).toBeDefined();
    expect(settings[0]?.storage_default_folder).toEqual(folders[0]?.id);
  });

  it('push with settings dependencies on an empty instance (role)', async () => {
    // Init sync client
    const sync = await context.getSync(
      'sources/dependencies-settings-default-role',
    );
    const directus = context.getDirectus();
    const client = directus.get();

    const pushOutput = await sync.push();
    expect(pushOutput).toContain(debug('[snapshot] No changes to apply'));
    expect(pushOutput).toContain(info('[roles] Created 1 items'));
    expect(pushOutput).toContain(info('[settings] Updated 1 items'));

    const { settings, roles } = await readAllSystemCollections(client);
    expect(settings.length).toEqual(1);
    expect(roles.length).toEqual(1);
    expect(settings[0]?.public_registration_role).toEqual(roles[0]?.id);
  });
};
