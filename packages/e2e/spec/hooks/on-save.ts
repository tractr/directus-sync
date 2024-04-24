import {
  Context,
  createOneItemInEachSystemCollection,
  getDumpedSystemCollectionsContents,
} from '../helpers/index.js';

export const onSave = (context: Context) => {
  it('ensure on save hook can change the data', async () => {
    // Init sync client
    const sync = await context.getSync(
      'temp/on-save',
      true,
      'on-save/directus-sync.config.cjs',
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
    const savedDashboard = collections.dashboards[0];
    expect(savedDashboard).toBeDefined();
    if (savedDashboard) {
      expect(savedDashboard.name).toEqual(`[onSave dashboard] ${dashboard.name}`);
    }

    expect(collections.flows.length).toEqual(1);
    const savedFlow = collections.flows[0];
    expect(savedFlow).toBeDefined();
    if (savedFlow) {
      expect(savedFlow.name).toEqual(`[onSave flow] ${flow.name}`);
    }

    expect(collections.folders.length).toEqual(1);
    const savedFolder = collections.folders[0];
    expect(savedFolder).toBeDefined();
    if (savedFolder) {
      expect(savedFolder.name).toEqual(`[onSave folder] ${folder.name}`);
    }

    expect(collections.operations.length).toEqual(1);
    const savedOperation = collections.operations[0];
    expect(savedOperation).toBeDefined();
    if (savedOperation) {
      expect(savedOperation.name).toEqual(`[onSave operation] ${operation.name}`);
    }

    expect(collections.panels.length).toEqual(1);
    const savedPanel = collections.panels[0];
    expect(savedPanel).toBeDefined();
    if (savedPanel) {
      expect(savedPanel.name).toEqual(`[onSave panel] ${panel.name}`);
    }

    expect(collections.roles.length).toEqual(1);
    const savedRole = collections.roles[0];
    expect(savedRole).toBeDefined();
    if (savedRole) {
      expect(savedRole.name).toEqual(`[onSave role] ${role.name}`);
    }

    expect(collections.permissions.length).toEqual(1);
    const savedPermission = collections.permissions[0];
    expect(savedPermission).toBeDefined();
    if (savedPermission) {
      expect(savedPermission.collection).toEqual(
        `[onSave permission] ${permission.collection}`,
      );
    }

    expect(collections.presets.length).toEqual(1);
    const savedPreset = collections.presets[0];
    expect(savedPreset).toBeDefined();
    if (savedPreset) {
      expect(savedPreset.bookmark).toEqual(`[onSave preset] ${preset.bookmark}`);
    }

    expect(collections.settings.length).toEqual(1);
    const savedSettings = collections.settings[0];
    expect(savedSettings).toBeDefined();
    if (savedSettings) {
      expect(savedSettings.project_name).toEqual(
        `[onSave settings] ${settings.project_name}`,
      );
    }

    expect(collections.translations.length).toEqual(1);
    const savedTranslation = collections.translations[0];
    expect(savedTranslation).toBeDefined();
    if (savedTranslation) {
      expect(savedTranslation.value).toEqual(
        `[onSave translation] ${translation.value}`,
      );
    }

    expect(collections.webhooks.length).toEqual(1);
    const savedWebhook = collections.webhooks[0];
    expect(savedWebhook).toBeDefined();
    if (savedWebhook) {
      expect(savedWebhook.name).toEqual(`[onSave webhook] ${webhook.name}`);
    }
  });
};
