---
sidebar_position: 2
---

# Collections Prefix

Managing collection prefixes in Directus Sync requires specific configuration to handle different naming conventions across environments.

## Common Issues

### Prefix Mismatch

```bash
# Collection not found
Error: Collection 'dev_users' not found
```

### System Collections

```bash
# System collection error
Error: Cannot modify system collection 'directus_users'
```

## Solutions

### Prefix Configuration

```javascript
// directus-sync.config.js
module.exports = {
  collections: {
    prefix: {
      source: 'dev_',
      target: 'prod_'
    }
  }
};
```

### System Collections Handling

```javascript
module.exports = {
  collections: {
    system: {
      include: ['directus_users'],
      exclude: ['directus_migrations']
    }
  }
};
```

### Collection Mapping

```javascript
module.exports = {
  collections: {
    map: {
      'source_collection': 'target_collection',
      'old_name': 'new_name'
    }
  }
};
```

## Best Practices

1. Define consistent prefix patterns
2. Handle system collections explicitly
3. Document collection mappings
4. Test prefix configurations 