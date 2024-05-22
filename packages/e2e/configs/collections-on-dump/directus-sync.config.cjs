module.exports = {
  hooks: {
    dashboards: {
      onDump: (dashboards) => {
        return dashboards.map((dashboard) => {
          dashboard.name = `[onDump dashboard] ${dashboard.name}`;
          return dashboard;
        });
      },
    },
    flows: {
      onDump: (flows) => {
        return flows.map((flow) => {
          flow.name = `[onDump flow] ${flow.name}`;
          return flow;
        });
      },
    },
    folders: {
      onDump: (folders) => {
        return folders.map((folder) => {
          folder.name = `[onDump folder] ${folder.name}`;
          return folder;
        });
      },
    },
    operations: {
      onDump: (operations) => {
        return operations.map((operation) => {
          operation.name = `[onDump operation] ${operation.name}`;
          return operation;
        });
      },
    },
    panels: {
      onDump: (panels) => {
        return panels.map((panel) => {
          panel.name = `[onDump panel] ${panel.name}`;
          return panel;
        });
      },
    },
    roles: {
      onDump: (roles) => {
        return roles.map((role) => {
          role.name = `[onDump role] ${role.name}`;
          return role;
        });
      },
    },
    permissions: {
      onDump: (permissions) => {
        return permissions.map((permission) => {
          permission.collection = `[onDump permission] ${permission.collection}`;
          return permission;
        });
      },
    },
    presets: {
      onDump: (presets) => {
        return presets.map((preset) => {
          preset.bookmark = `[onDump preset] ${preset.bookmark}`;
          return preset;
        });
      },
    },
    settings: {
      onDump: (settings) => {
        return settings.map((setting) => {
          setting.project_name = `[onDump settings] ${setting.project_name}`;
          return setting;
        });
      },
    },
    translations: {
      onDump: (translations) => {
        return translations.map((translation) => {
          translation.value = `[onDump translation] ${translation.value}`;
          return translation;
        });
      },
    },
  },
};
