import {
  Context,
  createOneItemInEachSystemCollection,
  getDumpedSystemCollectionsContents,
} from '../helpers/index.js';

export const collectionsOnSave = (context: Context) => {
  it('ensure on save hook can change the data', async () => {
    // Init sync client
    const sync = await context.getSync(
      'temp/collections-on-save',
      true,
      'collections-on-save/directus-sync.config.cjs',
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
    } = await createOneItemInEachSystemCollection(client);

    await sync.pull();

    // --------------------------------------------------------------------
    // Check if the content was changed correctly
    const collections = getDumpedSystemCollectionsContents(sync.getDumpPath());

    expect(collections.dashboards.length).toEqual(1);
    expect(collections.dashboards[0]!.name).toEqual(
      `[onSave dashboard] ${dashboard.name}`,
    );

    expect(collections.flows.length).toEqual(1);
    expect(collections.flows[0]!.name).toEqual(`[onSave flow] ${flow.name}`);

    expect(collections.folders.length).toEqual(1);
    expect(collections.folders[0]!.name).toEqual(
      `[onSave folder] ${folder.name}`,
    );

    expect(collections.operations.length).toEqual(1);
    expect(collections.operations[0]!.name).toEqual(
      `[onSave operation] ${operation.name}`,
    );

    expect(collections.panels.length).toEqual(1);
    expect(collections.panels[0]!.name).toEqual(`[onSave panel] ${panel.name}`);

    expect(collections.roles.length).toEqual(1);
    expect(collections.roles[0]!.name).toEqual(`[onSave role] ${role.name}`);

    expect(collections.permissions.length).toEqual(1);
    expect(collections.permissions[0]!.collection).toEqual(
      `[onSave permission] ${permission.collection}`,
    );

    expect(collections.presets.length).toEqual(1);
    expect(collections.presets[0]!.bookmark).toEqual(
      `[onSave preset] ${preset.bookmark}`,
    );

    expect(collections.settings.length).toEqual(1);
    expect(collections.settings[0]!.project_name).toEqual(
      `[onSave settings] ${settings.project_name}`,
    );

    expect(collections.translations.length).toEqual(1);
    expect(collections.translations[0]!.value).toEqual(
      `[onSave translation] ${translation.value}`,
    );
  });
};
