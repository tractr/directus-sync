---
sidebar_position: 3
---

# Mapping Table

The mapping table is a crucial component managed by the `directus-extension-sync` extension. It maintains the relationship between Directus's internal IDs and Directus Sync's tracking IDs (SyncIDs).

## Purpose

Since Directus doesn't support custom metadata or tags on its entities, the mapping table serves as a bridge between:
- Directus's internal UUID-based identification system
- Directus Sync's tracking system using SyncIDs

## Structure

The mapping table contains the following information:

```typescript
interface MappingEntry {
  id: string;           // Directus internal ID
  collection: string;   // Collection name (e.g., 'roles', 'permissions')
  sync_id: string;      // Directus Sync tracking ID
  created_at: string;   // When the mapping was created
  updated_at: string;   // Last update timestamp
}
```

## How It Works

### During Pull

1. Directus Sync retrieves elements from Directus
2. For each element:
   - Checks if it exists in the mapping table
   - If not, generates a new SyncID and creates a mapping
   - If yes, uses the existing SyncID
3. Stores configurations using SyncIDs

### During Push

1. Reads local configuration files with SyncIDs
2. Uses mapping table to:
   - Find existing elements by SyncID
   - Create new elements if no mapping exists
   - Update correct elements using Directus IDs

## Example

Here's how a role might be tracked:

```json
// Mapping table entry
{
  "id": "12a3b4c5-6d7e-8f9g-0h1i-2j3k4l5m6n7o",
  "collection": "directus_roles",
  "sync_id": "editor_role",
  "created_at": "2024-01-15T12:00:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}

// Local configuration (roles.json)
{
  "_sync_id": "editor_role",
  "name": "Editor",
  "admin_access": false,
  // ... other role properties
}
```

## Benefits

The mapping table provides several advantages:

1. **Persistence**: Maintains relationships across synchronizations
2. **Consistency**: Ensures same elements are updated correctly
3. **Independence**: Works with different Directus instance configurations
4. **Traceability**: Enables tracking of element history

## Next Steps

- Learn about the [synchronization process](synchronization-process.md)
- Understand [schema management](schema-management.md)
- Explore [tracked elements](../advanced/tracked-elements.md) 