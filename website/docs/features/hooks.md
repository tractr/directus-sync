---
sidebar_position: 4
---

# Hooks

## Collections Hooks

In addition to the CLI commands, `directus-sync` also supports hooks. Hooks are JavaScript functions that are executed at specific points during the synchronization process. They can be used to transform the data coming from Directus or going to Directus.

Hooks are defined in the configuration file using the `hooks` property. Under this property, you can define the collection name and the hook function to be executed. Available collection names are: `dashboards`, `flows`, `folders`, `operations`, `panels`, `permissions`, `policies`, `presets`, `roles`, `settings` and `translations`.

For each collection, available hook functions are: `onQuery`, `onLoad`, `onSave`, and `onDump`. These can be asynchronous functions.

During the `pull` command:

- `onQuery` is executed just before the query is sent to Directus for get elements. It receives the query object as parameter and must return the query object. The second parameter is the Directus client.
- `onDump` is executed just after the data is retrieved from Directus and before it is saved to the dump files. The data is the raw data received from Directus. The second parameter is the Directus client. It must return the data to be saved to the dump files.
- `onSave` is executed just before the cleaned data is saved to the dump files. The "cleaned" data is the data without the columns that are ignored by `directus-sync` (such as `user_updated`) and with the relations replaced by the SyncIDs. The first parameter is the cleaned data and the second parameter is the Directus client. It must return the data to be saved to the dump files.

During the `push` command:

- `onLoad` is executed just after the data is loaded from the dump files. The data is the cleaned data, as described above. The first parameter is the data coming from the JSON file and the second parameter is the Directus client. It must return the data.

### Simple Example

Here is an example of a [configuration file](./configuration) with hooks:

```javascript
// ./directus-sync.config.js
module.exports = {
  hooks: {
    flows: {
      onDump: (flows) => {
        return flows.map((flow) => {
          flow.name = `🧊 ${flow.name}`;
          return flow;
        });
      },
      onSave: (flows) => {
        return flows.map((flow) => {
          flow.name = `🔥 ${flow.name}`;
          return flow;
        });
      },
      onLoad: (flows) => {
        return flows.map((flow) => {
          flow.name = flow.name.replace('🔥 ', '');
          return flow;
        });
      },
    },
  },
};
```

:::warning
The dump hook is called after the mapping of the SyncIDs. This means that the data received by the hook is already tracked. If you filter out some elements, they will be deleted during the `push` command.
:::

### Filtering Out Elements

You can use `onQuery` hook to filter out elements. This hook is executed just before the query is sent to Directus, during the `pull` command.

In the example below, the flows and operations whose name starts with `Test:` are filtered out and will not be tracked.

```javascript
// ./directus-sync.config.js
const testPrefix = 'Test:';

module.exports = {
  hooks: {
    flows: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          name: { _nstarts_with: testPrefix },
        };
        return query;
      },
    },
    operations: {
      onQuery: (query, client) => {
        query.filter = {
          ...query.filter,
          flow: { name: { _nstarts_with: testPrefix } },
        };
        return query;
      },
    },
  },
};
```

:::note
Directus-Sync may alter the query after this hook.
:::

### Using the Directus Client

The example below shows how to disable the flows whose name starts with `Test:` and add the flow name to the operation.

```javascript
const { readFlow } = require('@directus/sdk');

const testPrefix = 'Test:';

module.exports = {
  hooks: {
    flows: {
      onDump: (flows) => {
        return flows.map((flow) => {
          flow.status = flow.name.startsWith(testPrefix)
            ? 'inactive'
            : 'active';
        });
      },
    },
    operations: {
      onDump: async (operations, client) => {
        for (const operation of operations) {
          const flow = await client.request(readFlow(operation.flow));
          if (flow) {
            operation.name = `${flow.name}: ${operation.name}`;
          }
        }
        return operations;
      },
    },
  },
};
```

## Snapshot Hooks

Like the collections hooks, the snapshot hooks are defined in the configuration file using the `hooks.snapshot` property. Under this property, you can define the hook functions to be executed.

Available hook functions are: `onLoad`, `onSave`:

- `onLoad` is executed during the `push` and `diff` processes, just after the data is loaded from the files, and before it is sent to Directus.
- `onSave` is executed during the `pull` process, just before the data is saved to the files.

:::note
This function can be **asynchronous**. It receives the snapshot object and the Directus client as parameters and must return the snapshot object.
:::

Here is an example of a configuration file that exclude some fields when loading the snapshot. This will be similar for the `onSave` hook.

```javascript
// ./directus-sync.config.js
module.exports = {
  hooks: {
    snapshot: {
      /**
       * @param {Snapshot} snapshot
       * @param {DirectusClient} client
       */
      onLoad: async (snapshot, client) => {
        // Remove some fields from the snapshot
        const fieldsToExclude = {
          my_model: ['date_created', 'user_created'],
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
```

:::note
For more information about the snapshot object, see the [Snapshot](https://github.com/tractr/directus-sync/blob/main/packages/cli/src/lib/services/snapshot/interfaces.ts) interface. 
:::
