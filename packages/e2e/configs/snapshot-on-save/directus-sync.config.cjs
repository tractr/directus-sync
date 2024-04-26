module.exports = {
  hooks: {
    snapshot: {
      /**
       * @param {Snapshot} snapshot
       */
      onSave: (snapshot) => {
        // Remove some fields from the snapshot
        const fieldsToExclude = {
          test_model: ['date_created', 'user_created'],
        };
        const collections = Object.keys(fieldsToExclude);
        const nodeFilter = (node) => {
          const { collection } = node;
          return !(collections.includes(collection) && fieldsToExclude[collection].includes(node.field));
        }
        snapshot.fields = snapshot.fields.filter(nodeFilter);
        snapshot.relations = snapshot.relations.filter(nodeFilter);

        return snapshot;
      },
    },
  },
};
