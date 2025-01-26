---
sidebar_position: 4
---

# Hooks

Hooks are powerful extension points that allow you to customize how Directus Sync processes data. They can be used to transform data, filter elements, or add custom logic at various stages of the synchronization process.

## Types of Hooks

### Collection Hooks

Collection hooks are executed for specific collections during the synchronization process. Available collections are:
- `dashboards`
- `flows`
- `folders`
- `operations`
- `panels`
- `permissions`
- `policies`
- `presets`
- `roles`
- `settings`
- `translations`

### Schema Hooks

Schema hooks are executed during schema snapshot operations, allowing you to modify how the schema is processed.

## Hook Functions

### Collection Hook Functions

Each collection can implement these hook functions:

#### `onQuery`

Executed before querying Directus for elements:

```typescript
type OnQueryHook = (
  query: Record<string, any>,
  client: DirectusClient
) => Record<string, any>;
```

Example - Filter out test flows:
```javascript
hooks: {
  flows: {
    onQuery: (query) => ({
      ...query,
      filter: {
        ...query.filter,
        name: { _nstarts_with: 'Test:' },
      },
    }),
  },
}
```

#### `onDump`

Executed after retrieving elements from Directus, before any processing:

```typescript
type OnDumpHook = (
  elements: any[],
  client: DirectusClient
) => Promise<any[]> | any[];
```

Example - Add prefix to flow names:
```javascript
hooks: {
  flows: {
    onDump: (flows) => flows.map(flow => ({
      ...flow,
      name: `🔄 ${flow.name}`,
    })),
  },
}
```

#### `onSave`

Executed before saving elements to local files:

```typescript
type OnSaveHook = (
  elements: any[],
  client: DirectusClient
) => Promise<any[]> | any[];
```

Example - Filter sensitive data:
```javascript
hooks: {
  settings: {
    onSave: (settings) => settings.filter(
      setting => !setting.key.startsWith('secret_')
    ),
  },
}
```

#### `onLoad`

Executed when loading elements from local files:

```typescript
type OnLoadHook = (
  elements: any[],
  client: DirectusClient
) => Promise<any[]> | any[];
```

Example - Transform data before push:
```javascript
hooks: {
  roles: {
    onLoad: (roles) => roles.map(role => ({
      ...role,
      name: role.name.toUpperCase(),
    })),
  },
}
```

### Schema Hook Functions

#### `onLoad`

Executed when loading schema from files:

```typescript
type OnLoadHook = (
  snapshot: Snapshot,
  client: DirectusClient
) => Promise<Snapshot> | Snapshot;
```

Example - Exclude fields:
```javascript
hooks: {
  snapshot: {
    onLoad: (snapshot) => {
      const fieldsToExclude = {
        articles: ['date_created', 'user_created'],
      };
      
      snapshot.fields = snapshot.fields.filter(node => {
        const { collection, field } = node;
        return !(
          fieldsToExclude[collection]?.includes(field)
        );
      });
      
      return snapshot;
    },
  },
}
```

#### `onSave`

Executed before saving schema to files:

```typescript
type OnSaveHook = (
  snapshot: Snapshot,
  client: DirectusClient
) => Promise<Snapshot> | Snapshot;
```

Example - Add metadata:
```javascript
hooks: {
  snapshot: {
    onSave: (snapshot) => ({
      ...snapshot,
      meta: {
        generatedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
    }),
  },
}
```

## Use Cases

### Filtering Elements

```javascript
module.exports = {
  hooks: {
    operations: {
      onQuery: (query) => ({
        ...query,
        filter: {
          flow: { 
            name: { _nstarts_with: 'Production:' } 
          },
        },
      }),
    },
  },
}
```

### Data Transformation

```javascript
module.exports = {
  hooks: {
    flows: {
      onDump: async (flows, client) => {
        for (const flow of flows) {
          // Add flow name to operations
          const operations = await client.request(
            readOperations({ filter: { flow: flow.id } })
          );
          flow.operations = operations.map(op => ({
            ...op,
            name: `${flow.name}: ${op.name}`,
          }));
        }
        return flows;
      },
    },
  },
}
```

### Schema Customization

```javascript
module.exports = {
  hooks: {
    snapshot: {
      onLoad: (snapshot) => {
        // Add custom interface
        snapshot.fields.push({
          collection: 'articles',
          field: 'custom_field',
          type: 'string',
          meta: {
            interface: 'custom',
            options: { /* ... */ },
          },
        });
        return snapshot;
      },
    },
  },
}
```

### Environment-Specific Logic

```javascript
module.exports = {
  hooks: {
    settings: {
      onSave: (settings) => {
        if (process.env.NODE_ENV === 'production') {
          return settings.filter(
            setting => !setting.key.includes('dev_')
          );
        }
        return settings;
      },
    },
  },
}
```

## Best Practices

1. **Keep Hooks Focused**
   - Each hook should have a single responsibility
   - Use multiple hooks for complex transformations
   - Document hook purposes

2. **Error Handling**
   - Implement proper error handling
   - Return valid data structures
   - Log errors in debug mode

3. **Performance**
   - Minimize API calls in hooks
   - Use batch operations when possible
   - Cache results when appropriate

4. **Testing**
   - Test hooks with different inputs
   - Verify data integrity
   - Check edge cases

## Next Steps

- Explore [helper commands](helpers.md)
- Learn about [lifecycle and hooks](../advanced/lifecycle-and-hooks.md)
- See [configuration options](configuration.md) 