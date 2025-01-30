---
sidebar_position: 3
---

# Schema Management

The Directus schema, which defines the data modeling and user interface, is managed by the Directus API. However, for better code repository management, `directus-sync` stores the schema elements in separate files organized within a clear directory structure. This separation allows developers to easily track changes to the schema and apply version control principles to the database structure.

## Schema Snapshots

### What is a Schema Snapshot?

A schema snapshot is a complete representation of your Directus instance's data model, including:
- Collections
- Fields
- Relations
- Field Groups
- Custom Displays
- Interfaces
- Layouts

### Storage Format

By default, schema snapshots are:
- Stored in the `snapshot` directory
- Split into multiple files for better readability
- Formatted in JSON for version control

```
directus-config/
└── snapshot/
    ├── collections/
    │   ├── articles.json
    │   └── categories.json
    ├── fields/
    │   ├── articles.json
    │   └── categories.json
    └── relations/
        └── articles_categories.json
```
