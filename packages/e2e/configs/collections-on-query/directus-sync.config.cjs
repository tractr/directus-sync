module.exports = {
  hooks: {
    dashboards: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          name: { _eq: '@dashboard' },
        };
        return query;
      },
    },
    flows: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          name: { _eq: '@flow' },
        };
        return query;
      },
    },
    folders: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          name: { _eq: '@folder' },
        };
        return query;
      },
    },
    operations: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          name: { _eq: '@operation' },
        };
        return query;
      },
    },
    panels: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          name: { _eq: '@panel' },
        };
        return query;
      },
    },
    roles: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          name: { _eq: '@role' },
        };
        return query;
      },
    },
    policies: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          name: { _eq: '@policy' },
        };
        return query;
      },
    },
    permissions: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          collection: { _eq: '@permission' },
        };
        return query;
      },
    },
    presets: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          bookmark: { _eq: '@preset' },
        };
        return query;
      },
    },
    settings: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          project_name: { _eq: '@settings' },
        };
        return query;
      },
    },
    translations: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          value: { _eq: '@translation' },
        };
        return query;
      },
    },
  },
};
