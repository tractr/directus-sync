module.exports = {
  hooks: {
    dashboards: {
      onSave: (dashboards) => {
        return dashboards.map((dashboard) => {
          dashboard.name = `[onSave dashboard] ${dashboard.name}`;
          return dashboard;
        });
      },
    },
    flows: {
      onSave: (flows) => {
        return flows.map((flow) => {
          flow.name = `[onSave flow] ${flow.name}`;
          return flow;
        });
      },
    },
    folders: {
      onSave: (folders) => {
        return folders.map((folder) => {
          folder.name = `[onSave folder] ${folder.name}`;
          return folder;
        });
      },
    },
    operations: {
      onSave: (operations) => {
        return operations.map((operation) => {
          operation.name = `[onSave operation] ${operation.name}`;
          return operation;
        });
      },
    },
    panels: {
      onSave: (panels) => {
        return panels.map((panel) => {
          panel.name = `[onSave panel] ${panel.name}`;
          return panel;
        });
      },
    },
    roles: {
      onSave: (roles) => {
        return roles.map((role) => {
          role.name = `[onSave role] ${role.name}`;
          return role;
        });
      },
    },
    permissions: {
      onSave: (permissions) => {
        return permissions.map((permission) => {
          permission.collection = `[onSave permission] ${permission.collection}`;
          return permission;
        });
      },
    },
    presets: {
      onSave: (presets) => {
        return presets.map((preset) => {
          preset.bookmark = `[onSave preset] ${preset.bookmark}`;
          return preset;
        });
      },
    },
    settings: {
      onSave: (settings) => {
        return settings.map((setting) => {
          setting.project_name = `[onSave settings] ${setting.project_name}`;
          return setting;
        });
      },
    },
    translations: {
      onSave: (translations) => {
        return translations.map((translation) => {
          translation.value = `[onSave translation] ${translation.value}`;
          return translation;
        });
      },
    },
  },
};
