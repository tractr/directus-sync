---
sidebar_position: 1
---

# PostgreSQL Enum Types

Directus Sync can be used to manage PostgreSQL enumeration types across different environments.

## Configuration

```javascript
// directus-sync.config.js
module.exports = {
  hooks: {
    snapshot: {
      onLoad: async (snapshot) => {
        // Add enum types to snapshot
        snapshot.enums = [
          {
            name: 'user_status',
            values: ['active', 'inactive', 'pending'],
          },
          {
            name: 'order_status',
            values: ['draft', 'confirmed', 'shipped', 'delivered'],
          },
        ];
        return snapshot;
      },
      onSave: async (snapshot) => {
        // Save enum types from snapshot
        const enums = snapshot.enums || [];
        delete snapshot.enums;
        return snapshot;
      },
    },
  },
};
```

## Usage

### Creating Enum

```sql
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending');
```

### Using in Collections

```javascript
{
  "collection": "users",
  "field": "status",
  "type": "string",
  "schema": {
    "name": "status",
    "table": "users",
    "data_type": "user_status",
    "default_value": "pending"
  }
}
```

### Synchronization

```bash
# Pull configuration
npx directus-sync pull

# Check changes
npx directus-sync diff

# Apply changes
npx directus-sync push
```

## Best Practices

1. Define enum types in `onLoad` hook
2. Handle cleanup in `onSave` hook
3. Use appropriate default values
4. Test migrations in development environment 