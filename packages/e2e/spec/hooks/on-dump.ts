import {
  Context,
  createOneItemInEachSystemCollection,
  getDumpedSystemCollectionsContents,
} from '../helpers/index.js';

export const onDump = (context: Context) => {
  fit('ensure on dump hook can change the data', async () => {
    // Init sync client
    const sync = await context.getSync('temp/on-dump', true, 'on-dump/directus-sync.config.cjs');
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
    const dumpedDashboard = collections.dashboards[0];
    expect(dumpedDashboard).toBeDefined();
    if (dumpedDashboard) {
      expect(dumpedDashboard.name).toEqual(`[dashboard] ${dashboard.name}`);
    }

    expect(collections.flows.length).toEqual(1);
    const dumpedFlow = collections.flows[0];
    expect(dumpedFlow).toBeDefined();
    if (dumpedFlow) {
      expect(dumpedFlow.name).toEqual(`[flow] ${flow.name}`);
    }

    expect(collections.folders.length).toEqual(1);
    const dumpedFolder = collections.folders[0];
    expect(dumpedFolder).toBeDefined();
    if (dumpedFolder) {
      expect(dumpedFolder.name).toEqual(`[folder] ${folder.name}`);
    }

    expect(collections.operations.length).toEqual(1);
    const dumpedOperation = collections.operations[0];
    expect(dumpedOperation).toBeDefined();
    if (dumpedOperation) {
      expect(dumpedOperation.name).toEqual(`[operation] ${operation.name}`);
    }

    expect(collections.panels.length).toEqual(1);
    const dumpedPanel = collections.panels[0];
    expect(dumpedPanel).toBeDefined();
    if (dumpedPanel) {
      expect(dumpedPanel.name).toEqual(`[panel] ${panel.name}`);
    }

    expect(collections.roles.length).toEqual(1);
    const dumpedRole = collections.roles[0];
    expect(dumpedRole).toBeDefined();
    if (dumpedRole) {
      expect(dumpedRole.name).toEqual(`[role] ${role.name}`);
    }

    expect(collections.permissions.length).toEqual(1);
    const dumpedPermission = collections.permissions[0];
    expect(dumpedPermission).toBeDefined();
    if (dumpedPermission) {
      expect(dumpedPermission.collection).toEqual(`[permission] ${permission.collection}`);
    }

    expect(collections.presets.length).toEqual(1);
    const dumpedPreset = collections.presets[0];
    expect(dumpedPreset).toBeDefined();
    if (dumpedPreset) {
      expect(dumpedPreset.bookmark).toEqual(`[preset] ${preset.bookmark}`);
    }

    expect(collections.settings.length).toEqual(1);
    const dumpedSettings = collections.settings[0];
    expect(dumpedSettings).toBeDefined();
    if (dumpedSettings) {
      expect(dumpedSettings.project_name).toEqual(`[settings] ${settings.project_name}`);
    }

    expect(collections.translations.length).toEqual(1);
    const dumpedTranslation = collections.translations[0];
    expect(dumpedTranslation).toBeDefined();
    if (dumpedTranslation) {
      expect(dumpedTranslation.value).toEqual(`[translation] ${translation.value}`);
    }

    expect(collections.webhooks.length).toEqual(1);
    const dumpedWebhook = collections.webhooks[0];
    expect(dumpedWebhook).toBeDefined();
    if (dumpedWebhook) {
      expect(dumpedWebhook.name).toEqual(`[webhook] ${webhook.name}`);
    }

  });
};
