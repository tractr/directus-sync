---
sidebar_position: 3
---

# Configuration

Directus Sync can be configured through multiple methods, with options merging in the following order of precedence:
1. Command-line arguments
2. Environment variables
3. Configuration file
4. Default values

## Configuration File

### Supported Formats

The configuration file can be in JavaScript or JSON format:
- `directus-sync.config.js`
- `directus-sync.config.cjs`
- `directus-sync.config.json`

### Basic Configuration

```javascript
module.exports = {
  // Connection settings
  directusUrl: 'https://directus.example.com',
  directusToken: 'your-token',
  // OR
  directusEmail: 'admin@example.com',
  directusPassword: 'your-password',

  // Path configurations
  dumpPath: './directus-config',
  seedPath: './directus-config/seed',
  collectionsPath: 'collections',
  snapshotPath: 'snapshot',
  specsPath: 'specs',

  // Feature flags
  debug: false,
  snapshot: true,
  split: true,
  specs: true,

  // Collection management
  onlyCollections: ['roles', 'permissions'],
  excludeCollections: ['settings'],
  preserveIds: ['roles', 'panels'],

  // Advanced options
  maxPushRetries: 20,
}
```

### Extended Configuration

```javascript
module.exports = {
  // Extend another config file
  extends: ['./directus-sync.config.base.js'],

  // Directus client configuration
  directusConfig: {
    clientOptions: {
      // See https://docs.directus.io/guides/sdk/getting-started.html#polyfilling
    },
    restConfig: {
      // See https://docs.directus.io/packages/@directus/sdk/rest/interfaces/RestConfig.html
    },
  },

  // Hooks configuration
  hooks: {
    // Collection hooks
    flows: {
      onQuery: (query, client) => {
        // Modify query before execution
        return query;
      },
      onDump: async (flows, client) => {
        // Process flows after retrieval
        return flows;
      },
      onSave: (flows, client) => {
        // Modify flows before saving
        return flows;
      },
      onLoad: (flows, client) => {
        // Process flows when loading from files
        return flows;
      },
    },

    // Schema hooks
    snapshot: {
      onLoad: async (snapshot, client) => {
        // Process snapshot when loading
        return snapshot;
      },
      onSave: async (snapshot, client) => {
        // Process snapshot before saving
        return snapshot;
      },
    },
  },
}
```

## Environment Variables

```bash
# Connection
DIRECTUS_URL=https://directus.example.com
DIRECTUS_TOKEN=your-token
# OR
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=your-password

# Paths
DIRECTUS_SYNC_DUMP_PATH=./directus-config
DIRECTUS_SYNC_SEED_PATH=./directus-config/seed
DIRECTUS_SYNC_COLLECTIONS_PATH=collections
DIRECTUS_SYNC_SNAPSHOT_PATH=snapshot
DIRECTUS_SYNC_SPECS_PATH=specs

# Features
DIRECTUS_SYNC_DEBUG=true
DIRECTUS_SYNC_NO_SNAPSHOT=false
DIRECTUS_SYNC_NO_SPLIT=false
DIRECTUS_SYNC_NO_SPECS=false
```

## Configuration Options

### Connection Settings

| Option | Environment Variable | Description |
|--------|---------------------|-------------|
| `directusUrl` | `DIRECTUS_URL` | Directus instance URL |
| `directusToken` | `DIRECTUS_TOKEN` | Access token |
| `directusEmail` | `DIRECTUS_ADMIN_EMAIL` | Admin email (if no token) |
| `directusPassword` | `DIRECTUS_ADMIN_PASSWORD` | Admin password (if no token) |

### Path Settings

| Option | Environment Variable | Default | Description |
|--------|---------------------|---------|-------------|
| `dumpPath` | `DIRECTUS_SYNC_DUMP_PATH` | `./directus-config` | Base path for dumps |
| `seedPath` | `DIRECTUS_SYNC_SEED_PATH` | `./directus-config/seed` | Seed data path |
| `collectionsPath` | `DIRECTUS_SYNC_COLLECTIONS_PATH` | `collections` | Collections dump path |
| `snapshotPath` | `DIRECTUS_SYNC_SNAPSHOT_PATH` | `snapshot` | Schema snapshot path |
| `specsPath` | `DIRECTUS_SYNC_SPECS_PATH` | `specs` | API specs path |

### Feature Flags

| Option | Environment Variable | Default | Description |
|--------|---------------------|---------|-------------|
| `debug` | `DIRECTUS_SYNC_DEBUG` | `false` | Enable debug logging |
| `snapshot` | `DIRECTUS_SYNC_NO_SNAPSHOT` | `true` | Enable schema snapshot |
| `split` | `DIRECTUS_SYNC_NO_SPLIT` | `true` | Split schema files |
| `specs` | `DIRECTUS_SYNC_NO_SPECS` | `true` | Enable API specs |

### Collection Management

| Option | Description |
|--------|-------------|
| `onlyCollections` | Collections to include |
| `excludeCollections` | Collections to exclude |
| `preserveIds` | Collections to preserve IDs |
| `maxPushRetries` | Maximum push retry attempts |

## Next Steps

- Learn about [hooks](hooks.md)
- Explore [helper commands](helpers.md)
- See [advanced features](../advanced/lifecycle-and-hooks.md) 