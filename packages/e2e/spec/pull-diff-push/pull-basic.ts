import {
  Context,
  createOneItemInEachSystemCollection,
  debug,
  getDefaultItemsCount,
  getDumpedSystemCollectionsContents,
  getSystemCollectionsNames,
} from '../helpers/index.js';

export const pullBasic = (context: Context) => {
  fit('should pull items from Directus', async () => {
    // Init sync client
    const sync = await context.getSync('temp/pull-basic');
    const directus = context.getDirectus();

    const systemCollections = getSystemCollectionsNames();

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
      policy,
      permission,
      preset,
      settings,
      translation,
    } = await createOneItemInEachSystemCollection(client);

    // --------------------------------------------------------------------
    // Pull the content from Directus
    const output = await sync.pull();

    // --------------------------------------------------------------------
    // Check if the logs reports new content
    for (const collection of systemCollections) {
      const count = 1 + getDefaultItemsCount(collection);
      expect(output).toContain(debug(`[${collection}] Pulled ${count} items.`));
      expect(output).toContain(
        debug(`[${collection}] Post-processed ${count} items.`),
      );
    }

    // --------------------------------------------------------------------
    // Check created sync id
    for (const collection of systemCollections) {
      const count = 1 + getDefaultItemsCount(collection);
      expect((await directus.getSyncIdMaps(collection)).length).toBe(count);
    }

    // --------------------------------------------------------------------
    // Check if the content was dumped correctly
    const collections = getDumpedSystemCollectionsContents(sync.getDumpPath());
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
        flow: (await directus.getByLocalId('flows', flow.id)).sync_id,
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
        parent: role.parent,
      },
    ]);
    expect(collections.policies).toEqual([
      {
        _syncId: (await directus.getByLocalId('policies', policy.id)).sync_id,
        name: policy.name,
        description: policy.description,
        icon: policy.icon,
        ip_access: policy.ip_access,
        enforce_tfa: policy.enforce_tfa,
        admin_access: policy.admin_access,
        app_access: policy.app_access,
        roles: await Promise.all(
          policy.roles.map(async (role) => {
            return {
              role: (await directus.getByLocalId('roles', role.role)).sync_id,
              sort: role.sort,
            };
          }),
        ),
      },
    ]);
    expect(collections.permissions).toEqual([
      {
        _syncId: (await directus.getByLocalId('permissions', permission.id))
          .sync_id,
        policy: (await directus.getByLocalId('policies', policy.id)).sync_id,
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
        // user: undefined,
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
        public_registration: settings.public_registration,
        public_registration_verify_email:
          settings.public_registration_verify_email,
        public_registration_role: (
          await directus.getByLocalId('roles', role.id)
        ).sync_id,
        public_registration_email_filter:
          settings.public_registration_email_filter,
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
  });
};
