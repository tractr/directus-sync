const duplicate = (items) => [...items, ...items];

module.exports = {
  hooks: {
    dashboards: { onDump: duplicate, onSave: duplicate },
    flows: { onDump: duplicate, onSave: duplicate },
    folders: { onDump: duplicate, onSave: duplicate },
    operations: { onDump: duplicate, onSave: duplicate },
    panels: { onDump: duplicate, onSave: duplicate },
    roles: { onDump: duplicate, onSave: duplicate },
    permissions: { onDump: duplicate, onSave: duplicate },
    presets: { onDump: duplicate, onSave: duplicate },
    settings: { onDump: duplicate, onSave: duplicate },
    translations: { onDump: duplicate, onSave: duplicate },
  },
};
