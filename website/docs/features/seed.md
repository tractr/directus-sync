---
sidebar_position: 2
---

# Seed Data

Directus Sync provides tools to manage seed data - initial or reference data for your collections.

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

### File Organization

```
directus-config/
└── seed/
    ├── roles.json
    ├── users.json
    ├── categories.json
    └── articles.json
```
