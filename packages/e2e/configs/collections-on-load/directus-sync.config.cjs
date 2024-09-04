module.exports = {
  hooks: {
    dashboards: {
      onLoad: (dashboards) => {
        return dashboards.map((dashboard) => {
          dashboard.name = `[onLoad dashboard] ${dashboard.name}`;
          return dashboard;
        });
      },
    },
    flows: {
      onLoad: (flows) => {
        return flows.map((flow) => {
          flow.name = `[onLoad flow] ${flow.name}`;
          return flow;
        });
      },
    },
    folders: {
      onLoad: (folders) => {
        return folders.map((folder) => {
          folder.name = `[onLoad folder] ${folder.name}`;
          return folder;
        });
      },
    },
    operations: {
      onLoad: (operations) => {
        return operations.map((operation) => {
          operation.name = `[onLoad operation] ${operation.name}`;
          return operation;
        });
      },
    },
    panels: {
      onLoad: (panels) => {
        return panels.map((panel) => {
          panel.name = `[onLoad panel] ${panel.name}`;
          return panel;
        });
      },
    },
    roles: {
      onLoad: (roles) => {
        return roles.map((role) => {
          role.name = `[onLoad role] ${role.name}`;
          return role;
        });
      },
    },
    policies: {
      onLoad: (policies) => {
        return policies.map((policy) => {
          policy.name = `[onLoad policy] ${policy.name}`;
          return policy;
        });
      },
    },
    permissions: {
      onLoad: (permissions) => {
        return permissions.map((permission) => {
          permission.collection = `[onLoad permission] ${permission.collection}`;
          return permission;
        });
      },
    },
    presets: {
      onLoad: (presets) => {
        return presets.map((preset) => {
          preset.bookmark = `[onLoad preset] ${preset.bookmark}`;
          return preset;
        });
      },
    },
    settings: {
      onLoad: (settings) => {
        return settings.map((setting) => {
          setting.project_name = `[onLoad settings] ${setting.project_name}`;
          return setting;
        });
      },
    },
    translations: {
      onLoad: (translations) => {
        return translations.map((translation) => {
          translation.value = `[onLoad translation] ${translation.value}`;
          return translation;
        });
      },
    },
  },
};
