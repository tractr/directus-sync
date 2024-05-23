import {
  Context,
  createOneItemInEachSystemCollection,
  getDumpedSystemCollectionsContents,
  readAllSystemCollections,
} from '../helpers/index.js';

export const collectionsOnQuery = (context: Context) => {
  it('ensure on query hook can filter the content', async () => {
    // Init sync client
    const sync = await context.getSync(
      'temp/collections-on-query',
      true,
      'collections-on-query/directus-sync.config.cjs',
    );
    const directus = context.getDirectus();

    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
    const {
      dashboard,
      flow,
      folder,
      operation,
      panel,
      role,
      permission,
      preset,
      settings,
      translation,
    } = await createOneItemInEachSystemCollection(client, {
      dashboards: { name: '@dashboard' },
      flows: { name: '@flow' },
      folders: { name: '@folder' },
      operations: { name: '@operation' },
      panels: { name: '@panel' },
      roles: { name: '@role' },
      permissions: { collection: '@permission' },
      presets: { bookmark: '@preset' },
      settings: { project_name: '@settings' },
      translations: { value: '@translation' },
    });
    // Create 2nd item in each collection
    await createOneItemInEachSystemCollection(client);

    // --------------------------------------------------------------------
    // Ensure that we have 2 items in each collection
    const remoteCollections = await readAllSystemCollections(client);
    for (const [collection, items] of Object.entries(remoteCollections)) {
      expect(items.length)
        .withContext(collection)
        .toEqual(collection === 'settings' ? 1 : 2);
    }

    // --------------------------------------------------------------------
    await sync.pull();

    // --------------------------------------------------------------------
    // Check if the content match the first batch
    const collections = getDumpedSystemCollectionsContents(sync.getDumpPath());

    expect(collections.dashboards.length).toEqual(1);
    expect(collections.dashboards[0]!._syncId).toEqual(
      (await directus.getByLocalId('dashboards', dashboard.id)).sync_id,
    );

    expect(collections.flows.length).toEqual(1);
    expect(collections.flows[0]!._syncId).toEqual(
      (await directus.getByLocalId('flows', flow.id)).sync_id,
    );

    expect(collections.folders.length).toEqual(1);
    expect(collections.folders[0]!._syncId).toEqual(
      (await directus.getByLocalId('folders', folder.id)).sync_id,
    );

    expect(collections.operations.length).toEqual(1);
    expect(collections.operations[0]!._syncId).toEqual(
      (await directus.getByLocalId('operations', operation.id)).sync_id,
    );

    expect(collections.panels.length).toEqual(1);
    expect(collections.panels[0]!._syncId).toEqual(
      (await directus.getByLocalId('panels', panel.id)).sync_id,
    );

    expect(collections.roles.length).toEqual(1);
    expect(collections.roles[0]!._syncId).toEqual(
      (await directus.getByLocalId('roles', role.id)).sync_id,
    );

    expect(collections.permissions.length).toEqual(1);
    expect(collections.permissions[0]!._syncId).toEqual(
      (await directus.getByLocalId('permissions', permission.id)).sync_id,
    );

    expect(collections.presets.length).toEqual(1);
    expect(collections.presets[0]!._syncId).toEqual(
      (await directus.getByLocalId('presets', preset.id)).sync_id,
    );

    expect(collections.settings.length).toEqual(1);
    expect(collections.settings[0]!._syncId).toEqual(
      (await directus.getByLocalId('settings', settings.id)).sync_id,
    );

    expect(collections.translations.length).toEqual(1);
    expect(collections.translations[0]!._syncId).toEqual(
      (await directus.getByLocalId('translations', translation.id)).sync_id,
    );
  });
};
