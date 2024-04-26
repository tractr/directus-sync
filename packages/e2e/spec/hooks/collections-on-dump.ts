import {
  Context,
  createOneItemInEachSystemCollection,
  getDumpedSystemCollectionsContents,
} from '../helpers/index.js';

export const collectionsOnDump = (context: Context) => {
  it('ensure on dump hook can change the data', async () => {
    // Init sync client
    const sync = await context.getSync(
      'temp/on-dump',
      true,
      'on-dump/directus-sync.config.cjs',
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
      webhook,
    } = await createOneItemInEachSystemCollection(client);

    await sync.pull();

    // --------------------------------------------------------------------
    // Check if the content was changed correctly
    const collections = getDumpedSystemCollectionsContents(sync.getDumpPath());

    expect(collections.dashboards.length).toEqual(1);
    expect(collections.dashboards[0]!.name).toEqual(
      `[onDump dashboard] ${dashboard.name}`,
    );

    expect(collections.flows.length).toEqual(1);
    expect(collections.flows[0]!.name).toEqual(`[onDump flow] ${flow.name}`);

    expect(collections.folders.length).toEqual(1);
    expect(collections.folders[0]!.name).toEqual(
      `[onDump folder] ${folder.name}`,
    );

    expect(collections.operations.length).toEqual(1);
    expect(collections.operations[0]!.name).toEqual(
      `[onDump operation] ${operation.name}`,
    );

    expect(collections.panels.length).toEqual(1);
    expect(collections.panels[0]!.name).toEqual(`[onDump panel] ${panel.name}`);

    expect(collections.roles.length).toEqual(1);
    expect(collections.roles[0]!.name).toEqual(`[onDump role] ${role.name}`);

    expect(collections.permissions.length).toEqual(1);
    expect(collections.permissions[0]!.collection).toEqual(
      `[onDump permission] ${permission.collection}`,
    );

    expect(collections.presets.length).toEqual(1);
    expect(collections.presets[0]!.bookmark).toEqual(
      `[onDump preset] ${preset.bookmark}`,
    );

    expect(collections.settings.length).toEqual(1);
    expect(collections.settings[0]!.project_name).toEqual(
      `[onDump settings] ${settings.project_name}`,
    );

    expect(collections.translations.length).toEqual(1);
    expect(collections.translations[0]!.value).toEqual(
      `[onDump translation] ${translation.value}`,
    );

    expect(collections.webhooks.length).toEqual(1);
    expect(collections.webhooks[0]!.name).toEqual(
      `[onDump webhook] ${webhook.name}`,
    );
  });
};
