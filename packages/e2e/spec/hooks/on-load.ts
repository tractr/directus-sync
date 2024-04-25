import {
  Context,
  getDumpedSystemCollectionsContents,
  readAllSystemCollections,
} from '../helpers/index.js';

export const onLoad = (context: Context) => {
  it('ensure on load hook can change the data', async () => {
    // Init sync client
    const sync = await context.getSync(
      'sources/one-item-per-collection',
      false,
      'on-load/directus-sync.config.cjs',
    );
    const directus = context.getDirectus();

    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const {
      dashboards: sourceDashboards,
      flows: sourceFlows,
      folders: sourceFolders,
      operations: sourceOperations,
      panels: sourcePanels,
      roles: sourceRoles,
      permissions: sourcePermissions,
      presets: sourcePresets,
      settings: sourceSettings,
      translations: sourceTranslations,
      webhooks: sourceWebhooks,
    } = getDumpedSystemCollectionsContents(sync.getDumpPath());

    await sync.push();

    // --------------------------------------------------------------------
    // Check if the content was changed correctly
    const client = directus.get();
    const collections = await readAllSystemCollections(client);

    expect(collections.dashboards[0]!.name).toEqual(
      `[onLoad dashboard] ${sourceDashboards[0]!.name}`,
    );
    expect(collections.flows[0]!.name).toEqual(
      `[onLoad flow] ${sourceFlows[0]!.name}`,
    );
    expect(collections.folders[0]!.name).toEqual(
      `[onLoad folder] ${sourceFolders[0]!.name}`,
    );
    expect(collections.operations[0]!.name).toEqual(
      `[onLoad operation] ${sourceOperations[0]!.name}`,
    );
    expect(collections.panels[0]!.name).toEqual(
      `[onLoad panel] ${sourcePanels[0]!.name}`,
    );
    expect(collections.roles[0]!.name).toEqual(
      `[onLoad role] ${sourceRoles[0]!.name}`,
    );
    expect(collections.permissions[0]!.collection).toEqual(
      `[onLoad permission] ${sourcePermissions[0]!.collection}`,
    );
    expect(collections.presets[0]!.bookmark).toEqual(
      `[onLoad preset] ${sourcePresets[0]!.bookmark}`,
    );
    expect(collections.settings[0]!.project_name).toEqual(
      `[onLoad settings] ${sourceSettings[0]!.project_name}`,
    );
    expect(collections.translations[0]!.value).toEqual(
      `[onLoad translation] ${sourceTranslations[0]!.value}`,
    );
    expect(collections.webhooks[0]!.name).toEqual(
      `[onLoad webhook] ${sourceWebhooks[0]!.name}`,
    );
  });
};
