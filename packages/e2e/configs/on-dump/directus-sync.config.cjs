module.exports = {
  hooks: {
    dashboards: {
      onDump: (dashboards) => {
        return dashboards.map((dashboard) => {
          dashboard.name = `[dashboard] ${dashboard.name}`;
          return dashboard;
        });
      },
    },
    flows: {
      onDump: (flows) => {
        return flows.map((flow) => {
          flow.name = `[flow] ${flow.name}`;
          return flow;
        });
      },
    },
    folders: {
      onDump: (folders) => {
        return folders.map((folder) => {
          folder.name = `[folder] ${folder.name}`;
          return folder;
        });
      },
    },
    operations: {
      onDump: (operations) => {
        return operations.map((operation) => {
          operation.name = `[operation] ${operation.name}`;
          return operation;
        });
      },
    },
    panels: {
      onDump: (panels) => {
        return panels.map((panel) => {
          panel.name = `[panel] ${panel.name}`;
          return panel;
        });
      },
    },
    roles: {
      onDump: (roles) => {
        return roles.map((role) => {
          role.name = `[role] ${role.name}`;
          return role;
        });
      },
    },
    permissions: {
      onDump: (permissions) => {
        return permissions.map((permission) => {
          permission.collection = `[permission] ${permission.collection}`;
          return permission;
        });
      },
    },
    presets: {
      onDump: (presets) => {
        return presets.map((preset) => {
          preset.bookmark = `[preset] ${preset.bookmark}`;
          return preset;
        });
      },
    },
    settings: {
      onDump: (settings) => {
        return settings.map((setting) => {
          setting.project_name = `[settings] ${setting.project_name}`;
          return setting;
        });
      },
    },
    translations: {
      onDump: (translations) => {
        return translations.map((translation) => {
          translation.value = `[translation] ${translation.value}`;
          return translation;
        });
      },
    },
    webhooks: {
      onDump: (webhooks) => {
        return webhooks.map((webhook) => {
          webhook.name = `[webhook] ${webhook.name}`;
          return webhook;
        });
      },
    },
  },
};
