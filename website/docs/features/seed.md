---
sidebar_position: 2
---

# Seed Data Management

Directus Sync provides tools to manage seed data - initial or reference data for your collections. This feature helps maintain consistent test data across environments.

## Overview

Unlike schema and configuration synchronization, seed data:
- Must be manually created
- Is more flexible in structure
- Requires explicit configuration
- Is stored in JSON format

## Commands

### Seed Diff

```bash
npx directus-sync seed diff
```

Shows differences between local seed data and Directus instance:
- Identifies new items to create
- Shows modifications to existing items
- Lists items to be deleted
- Non-destructive operation

### Seed Push

```bash
npx directus-sync seed push
```

Applies seed data changes to your Directus instance:
- Creates new items
- Updates existing items
- Removes tracked items not in seed files
- Maintains relationships

## Seed File Structure

### Basic Structure

```json
{
    "collection": "collection_name",
    "meta": {
        "insert_order": 1,
        "create": true,
        "update": true,
        "delete": true,
        "preserve_ids": false,
        "ignore_on_update": []
    },
    "data": [
        {
            "_sync_id": "unique-identifier",
            "field1": "value1",
            "field2": "value2"
        }
    ]
}
```

### Meta Options

- `insert_order`: Order of insertion (for dependencies)
- `create`: Whether to create new items
- `update`: Whether to update existing items
- `delete`: Whether to delete missing items
- `preserve_ids`: Whether to keep original IDs
- `ignore_on_update`: Fields to ignore during updates

## Examples

### Basic Collection

```json
{
    "collection": "categories",
    "meta": {
        "insert_order": 1
    },
    "data": [
        {
            "_sync_id": "category-tech",
            "name": "Technology",
            "slug": "tech",
            "status": "published"
        },
        {
            "_sync_id": "category-science",
            "name": "Science",
            "slug": "science",
            "status": "published"
        }
    ]
}
```

### Collection with Relations

```json
{
    "collection": "articles",
    "meta": {
        "insert_order": 2
    },
    "data": [
        {
            "_sync_id": "article-1",
            "title": "Future of AI",
            "category": "category-tech",
            "status": "published"
        }
    ]
}
```

### System Users

```json
{
    "collection": "directus_users",
    "meta": {
        "insert_order": 1,
        "ignore_on_update": ["password"]
    },
    "data": [
        {
            "_sync_id": "user-editor",
            "first_name": "John",
            "last_name": "Editor",
            "email": "editor@example.com",
            "role": "_sync_editor_role"
        }
    ]
}
```

## Best Practices

### File Organization

```
directus-config/
└── seed/
    ├── 01-roles.json
    ├── 02-users.json
    ├── 03-categories.json
    └── 04-articles.json
```

### Naming Conventions

1. **Files**:
   - Use numeric prefixes for order
   - Use descriptive names
   - Group related data

2. **SyncIDs**:
   - Prefix with collection name
   - Use descriptive identifiers
   - Maintain consistency

### Relations

1. **Order Matters**:
   - Set appropriate `insert_order`
   - Create referenced items first
   - Handle circular dependencies

2. **References**:
   - Use `_sync_id` for relations
   - Ensure referenced items exist
   - Validate relationships

## Next Steps

- Learn about [configuration options](configuration.md)
- Understand [hooks](hooks.md)
- Explore [helper commands](helpers.md) 