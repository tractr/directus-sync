import {
  DirectusInstance,
  DirectusSync,
  getSetupTimeout,
  getSystemCollectionsNames,
  info,
} from './sdk';
import Path from 'path';
import { rmSync } from 'fs-extra';
import {
  createOneItemInEachSystemCollection,
  deleteItemsFromSystemCollections,
  readAllSystemCollections,
} from './utils';

describe('Pull, flush everything and push', () => {
  const fileName = Path.basename(__filename, '.spec.ts');
  const dumpPath = Path.resolve(__dirname, 'dumps', fileName);
  const instance = new DirectusInstance();
  const directus = instance.getDirectusClient();
  let sync: DirectusSync;
  let originalData: Awaited<
    ReturnType<typeof createOneItemInEachSystemCollection>
  >;

  beforeAll(async () => {
    rmSync(dumpPath, { recursive: true, force: true });
    await instance.start();
    await directus.loginAsAdmin();
    sync = new DirectusSync({
      token: await directus.requireToken(),
      url: directus.getUrl(),
      dumpPath: dumpPath,
    });

    // -----------------------------------
    // Populate the instance with some data and pull then delete it
    const client = directus.get();
    originalData = await createOneItemInEachSystemCollection(client);
    await sync.pull();
    // Delete the content
    await deleteItemsFromSystemCollections(client, {
      dashboards: [originalData.dashboard.id],
      flows: [originalData.flow.id],
      folders: [originalData.folder.id],
      operations: [originalData.operation.id],
      panels: [originalData.panel.id],
      roles: [originalData.role.id],
      permissions: [originalData.permission.id],
      presets: [originalData.preset.id],
      translations: [originalData.translation.id],
      webhooks: [originalData.webhook.id],
    });
    // -----------------------------------
  }, getSetupTimeout());
  afterAll(() => {
    instance.stop();
  });

  it('should detect diff', async () => {
    const output = await sync.diff();
    const collections = getSystemCollectionsNames();
    expect(output).toContainEqual(info('[snapshot] No changes to apply'));

    for (const collection of collections) {
      if (collection === 'settings') {
        expect(output).toContainEqual(
          info(`[${collection}] Dangling id maps: 0 item(s)`),
        );
        expect(output).toContainEqual(
          info(`[${collection}] To create: 0 item(s)`),
        );
        expect(output).toContainEqual(
          info(`[${collection}] To update: 0 item(s)`),
        );
        expect(output).toContainEqual(
          info(`[${collection}] To delete: 0 item(s)`),
        );
        expect(output).toContainEqual(
          info(`[${collection}] Unchanged: 1 item(s)`),
        );
      } else {
        expect(output).toContainEqual(
          info(`[${collection}] Dangling id maps: 1 item(s)`),
        );
        expect(output).toContainEqual(
          info(`[${collection}] To create: 1 item(s)`),
        );
        expect(output).toContainEqual(
          info(`[${collection}] To update: 0 item(s)`),
        );
        expect(output).toContainEqual(
          info(`[${collection}] To delete: 0 item(s)`),
        );
        expect(output).toContainEqual(
          info(`[${collection}] Unchanged: 0 item(s)`),
        );
      }
    }
  });

  it('should recreate entries in Directus, same as original, and remove dangling ids', async () => {
    // Push the data back to Directus and analyze the output
    const client = directus.get();
    const output = await sync.push();
    const collections = getSystemCollectionsNames();
    expect(output).toContainEqual(info('[snapshot] No changes to apply'));

    for (const collection of collections) {
      if (collection === 'settings') {
        expect(output).toContainEqual(
          info(`[${collection}] Deleted 0 dangling items`),
        );
        expect(output).toContainEqual(info(`[${collection}] Created 0 items`));
        expect(output).toContainEqual(info(`[${collection}] Updated 0 items`));
      } else {
        expect(output).toContainEqual(
          info(`[${collection}] Deleted 1 dangling items`),
        );
        expect(output).toContainEqual(info(`[${collection}] Created 1 items`));
        expect(output).toContainEqual(info(`[${collection}] Updated 0 items`));
        expect(output).toContainEqual(info(`[${collection}] Deleted 0 items`));
      }
    }

    // Check if the dangling ids were removed
    for (const collection of collections) {
      expect((await directus.getSyncIdMaps(collection)).length).toBe(1);
    }

    // Read all data from Directus and check if the data is the same as the original data
    const all = await readAllSystemCollections(client);
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
    } = originalData;
    const getFirstId = (
      items: { id: string | number }[],
    ): string | number | undefined => {
      return items[0] ? items[0].id : undefined;
    };

    expect(all.dashboards[0]).toEqual(
      expect.objectContaining({
        id: getFirstId(all.dashboards),
        name: dashboard.name,
        icon: dashboard.icon,
        note: dashboard.note,
        color: dashboard.color,
      }),
    );
    expect(all.flows[0]).toEqual(
      expect.objectContaining({
        id: getFirstId(all.flows),
        name: flow.name,
        icon: flow.icon,
        color: flow.color,
        description: flow.description,
        status: flow.status,
        trigger: flow.trigger,
        accountability: flow.accountability,
        options: flow.options,
        operation: getFirstId(all.operations),
      }),
    );
    expect(all.folders[0]).toEqual(
      expect.objectContaining({
        id: getFirstId(all.folders),
        name: folder.name,
        parent: folder.parent,
      }),
    );
    expect(all.operations[0]).toEqual(
      expect.objectContaining({
        id: getFirstId(all.operations),
        name: operation.name,
        key: operation.key,
        type: operation.type,
        position_x: operation.position_x,
        position_y: operation.position_y,
        options: operation.options,
        resolve: operation.resolve,
        reject: operation.reject,
        flow: getFirstId(all.flows),
      }),
    );
    expect(all.panels[0]).toEqual(
      expect.objectContaining({
        id: getFirstId(all.panels),
        dashboard: getFirstId(all.dashboards),
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
      }),
    );
    expect(all.roles[0]).toEqual(
      expect.objectContaining({
        id: getFirstId(all.roles),
        name: role.name,
        icon: role.icon,
        description: role.description,
        ip_access: role.ip_access,
        enforce_tfa: role.enforce_tfa,
        admin_access: role.admin_access,
        app_access: role.app_access,
      }),
    );
    expect(all.permissions[0]).toEqual(
      expect.objectContaining({
        id: getFirstId(all.permissions),
        role: getFirstId(all.roles),
        collection: permission.collection,
        action: permission.action,
        permissions: permission.permissions,
        validation: permission.validation,
        presets: permission.presets,
        fields: permission.fields,
      }),
    );
    expect(all.presets[0]).toEqual(
      expect.objectContaining({
        id: getFirstId(all.presets),
        bookmark: preset.bookmark,
        role: preset.role,
        user: null,
        collection: preset.collection,
        search: preset.search,
        layout: preset.layout,
        layout_query: preset.layout_query,
        layout_options: preset.layout_options,
        refresh_interval: preset.refresh_interval,
        filter: preset.filter,
        icon: preset.icon,
        color: preset.color,
      }),
    );
    expect(all.settings[0]).toEqual(
      expect.objectContaining({
        id: getFirstId(all.settings),
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
        project_logo: null,
        project_url: null,
        public_background: null,
        public_favicon: null,
        public_foreground: null,
        // TODO: Added in 10.10.5
        // report_error_url: settings.report_error_url,
        // report_bug_url: settings.report_bug_url,
        // report_feature_url: settings.report_feature_url,
      }),
    );
    expect(all.translations[0]).toEqual(
      expect.objectContaining({
        id: getFirstId(all.translations),
        key: translation.key,
        value: translation.value,
        language: translation.language,
      }),
    );
    expect(all.webhooks[0]).toEqual(
      expect.objectContaining({
        id: getFirstId(all.webhooks),
        name: webhook.name,
        method: webhook.method,
        url: webhook.url,
        status: webhook.status,
        data: webhook.data,
        actions: webhook.actions,
        collections: webhook.collections,
        headers: webhook.headers,
      }),
    );
  });
});
