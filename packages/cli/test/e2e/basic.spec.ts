import {
  DirectusInstance,
  DirectusSettingsExtra,
  DirectusSync,
  getDumpedSystemCollectionsContents,
  getSetupTimeout,
} from './sdk';
import Path from 'path';
import { rmSync } from 'fs-extra';
import {
  createDashboard,
  createFlow,
  createFolder,
  createOperation,
  createPanel,
  createPermission,
  createPreset,
  createRole,
  createTranslation,
  createWebhook,
  DirectusSettings,
  updateFlow,
  updateSettings,
} from '@directus/sdk';
import {
  getDashboard,
  getFlow,
  getFolder,
  getOperation,
  getPanel,
  getPermission,
  getPreset,
  getRole,
  getSettings,
  getTranslation,
  getWebhook,
} from './seed';

describe('Empty instance configs', () => {
  const dumpPath = Path.resolve(__dirname, 'dumps/basic');
  const instance = new DirectusInstance();
  const directus = instance.getDirectusClient();
  let sync: DirectusSync;

  beforeAll(async () => {
    rmSync(dumpPath, { recursive: true, force: true });
    await instance.start();
    await directus.loginAsAdmin();
    sync = new DirectusSync({
      token: await directus.requireToken(),
      url: directus.getUrl(),
      dumpPath: dumpPath,
    });
  }, getSetupTimeout());
  afterAll(() => {
    instance.stop();
  });

  it('should pull items from Directus', async () => {
    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
    const dashboard = await client.request(createDashboard(getDashboard()));
    const flow = await client.request(createFlow(getFlow()));
    const folder = await client.request(createFolder(getFolder()));
    const operation = await client.request(
      createOperation(getOperation(flow.id)),
    );
    const panel = await client.request(createPanel(getPanel(dashboard.id)));
    const role = await client.request(createRole(getRole()));
    const permission = await client.request(
      createPermission(getPermission(role.id, 'dashboards', 'update')),
    );
    const preset = await client.request(createPreset(getPreset()));
    const settings = (await client.request(
      updateSettings(getSettings()),
    )) as never as DirectusSettings<object> & DirectusSettingsExtra;
    const translation = await client.request(
      createTranslation(getTranslation()),
    );
    const webhook = await client.request(createWebhook(getWebhook()));

    // --------------------------------------------------------------------
    // Update flow with operation
    await client.request(updateFlow(flow.id, { operation: operation.id }));

    // --------------------------------------------------------------------
    // Pull the content from Directus
    const output = await sync.pull();

    // --------------------------------------------------------------------
    // Check if the logs reports new content
    expect(output).toContain('[dashboards] Pulled 1 items');
    expect(output).toContain('[dashboards] Post-processed 1 items');
    expect(output).toContain('[flows] Pulled 1 items');
    expect(output).toContain('[flows] Post-processed 1 items');
    expect(output).toContain('[folders] Pulled 1 items');
    expect(output).toContain('[folders] Post-processed 1 items');
    expect(output).toContain('[operations] Pulled 1 items');
    expect(output).toContain('[operations] Post-processed 1 items');
    expect(output).toContain('[panels] Pulled 1 items');
    expect(output).toContain('[panels] Post-processed 1 items');
    expect(output).toContain('[roles] Pulled 1 items');
    expect(output).toContain('[roles] Post-processed 1 items');
    expect(output).toContain('[permissions] Pulled 1 items');
    expect(output).toContain('[permissions] Post-processed 1 items');
    expect(output).toContain('[presets] Pulled 1 items');
    expect(output).toContain('[presets] Post-processed 1 items');
    expect(output).toContain('[settings] Pulled 1 items');
    expect(output).toContain('[settings] Post-processed 1 items');
    expect(output).toContain('[translations] Pulled 1 items');
    expect(output).toContain('[translations] Post-processed 1 items');
    expect(output).toContain('[webhooks] Pulled 1 items');
    expect(output).toContain('[webhooks] Post-processed 1 items');

    // --------------------------------------------------------------------
    // Check created sync id
    expect((await directus.getSyncIdMaps('dashboards')).length).toBe(1);
    expect((await directus.getSyncIdMaps('flows')).length).toBe(1);
    expect((await directus.getSyncIdMaps('folders')).length).toBe(1);
    expect((await directus.getSyncIdMaps('operations')).length).toBe(1);
    expect((await directus.getSyncIdMaps('panels')).length).toBe(1);
    expect((await directus.getSyncIdMaps('roles')).length).toBe(1);
    expect((await directus.getSyncIdMaps('permissions')).length).toBe(1);
    expect((await directus.getSyncIdMaps('presets')).length).toBe(1);
    expect((await directus.getSyncIdMaps('settings')).length).toBe(1);
    expect((await directus.getSyncIdMaps('translations')).length).toBe(1);
    expect((await directus.getSyncIdMaps('webhooks')).length).toBe(1);

    // --------------------------------------------------------------------
    // Check if the content was dumped correctly
    const collections = getDumpedSystemCollectionsContents(dumpPath);
    expect(collections.dashboards).toEqual([
      {
        _syncId: (await directus.getByLocalId('dashboards', dashboard.id))
          .sync_id,
        name: dashboard.name,
        icon: dashboard.icon,
        note: dashboard.note,
        color: dashboard.color,
      },
    ]);
    expect(collections.flows).toEqual([
      {
        _syncId: (await directus.getByLocalId('flows', flow.id)).sync_id,
        name: flow.name,
        icon: flow.icon,
        color: flow.color,
        description: flow.description,
        status: flow.status,
        trigger: flow.trigger,
        accountability: flow.accountability,
        options: flow.options,
        operation: (await directus.getByLocalId('operations', operation.id))
          .sync_id,
      },
    ]);
    expect(collections.folders).toEqual([
      {
        _syncId: (await directus.getByLocalId('folders', folder.id)).sync_id,
        name: folder.name,
        parent: folder.parent,
      },
    ]);
    expect(collections.operations).toEqual([
      {
        _syncId: (await directus.getByLocalId('operations', operation.id))
          .sync_id,
        name: operation.name,
        key: operation.key,
        type: operation.type,
        position_x: operation.position_x,
        position_y: operation.position_y,
        options: operation.options,
        resolve: operation.resolve,
        reject: operation.reject,
        flow: operation.flow,
      },
    ]);
    expect(collections.panels).toEqual([
      {
        _syncId: (await directus.getByLocalId('panels', panel.id)).sync_id,
        dashboard: (await directus.getByLocalId('dashboards', dashboard.id))
          .sync_id,
        name: panel.name,
        icon: panel.icon,
        color: panel.color,
        show_header: panel.show_header,
        note: panel.note,
        type: panel.type,
        position_x: panel.position_x,
        position_y: panel.position_y,
        width: panel.width,
        height: panel.height,
        options: panel.options,
      },
    ]);
    expect(collections.roles).toEqual([
      {
        _syncId: (await directus.getByLocalId('roles', role.id)).sync_id,
        name: role.name,
        icon: role.icon,
        description: role.description,
        ip_access: role.ip_access,
        enforce_tfa: role.enforce_tfa,
        admin_access: role.admin_access,
        app_access: role.app_access,
      },
    ]);
    expect(collections.permissions).toEqual([
      {
        _syncId: (await directus.getByLocalId('permissions', permission.id))
          .sync_id,
        role: (await directus.getByLocalId('roles', role.id)).sync_id,
        collection: permission.collection,
        action: permission.action,
        permissions: permission.permissions,
        validation: permission.validation,
        presets: permission.presets,
        fields: permission.fields,
      },
    ]);
    expect(collections.presets).toEqual([
      {
        _syncId: (await directus.getByLocalId('presets', preset.id)).sync_id,
        bookmark: preset.bookmark,
        role: preset.role,
        user: undefined,
        collection: preset.collection,
        search: preset.search,
        layout: preset.layout,
        layout_query: preset.layout_query,
        layout_options: preset.layout_options,
        refresh_interval: preset.refresh_interval,
        filter: preset.filter,
        icon: preset.icon,
        color: preset.color,
      },
    ]);
    expect(collections.settings).toEqual([
      {
        _syncId: (await directus.getByLocalId('settings', settings.id)).sync_id,
        project_name: settings.project_name,
        project_color: settings.project_color,
        public_note: settings.public_note,
        auth_login_attempts: settings.auth_login_attempts,
        auth_password_policy: settings.auth_password_policy,
        storage_asset_transform: settings.storage_asset_transform,
        storage_asset_presets: settings.storage_asset_presets,
        custom_css: settings.custom_css,
        storage_default_folder: settings.storage_default_folder,
        basemaps: settings.basemaps,
        mapbox_key: settings.mapbox_key,
        module_bar: settings.module_bar,
        project_descriptor: settings.project_descriptor,
        default_language: settings.default_language,
        custom_aspect_ratios: settings.custom_aspect_ratios,
        default_appearance: settings.default_appearance,
        default_theme_light: settings.default_theme_light,
        theme_light_overrides: settings.theme_light_overrides,
        default_theme_dark: settings.default_theme_dark,
        theme_dark_overrides: settings.theme_dark_overrides,
        report_error_url: settings.report_error_url,
        report_bug_url: settings.report_bug_url,
        report_feature_url: settings.report_feature_url,
      },
    ]);
    expect(collections.translations).toEqual([
      {
        _syncId: (await directus.getByLocalId('translations', translation.id))
          .sync_id,
        key: translation.key,
        value: translation.value,
        language: translation.language,
      },
    ]);
    expect(collections.webhooks).toEqual([
      {
        _syncId: (await directus.getByLocalId('webhooks', webhook.id)).sync_id,
        name: webhook.name,
        method: webhook.method,
        url: webhook.url,
        status: webhook.status,
        data: webhook.data,
        actions: webhook.actions,
        collections: webhook.collections,
        headers: webhook.headers,
      },
    ]);
  });
});
