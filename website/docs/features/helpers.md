---
sidebar_position: 5
---

# Helper Commands

Directus Sync provides several utility commands to help manage and troubleshoot your synchronization process.

## Untrack Command

The `untrack` command removes tracking from specific elements in your Directus instance.

### Usage

```bash
npx directus-sync helpers untrack --collection <collection> --id <id>
```

### Parameters

- `--collection`: The collection containing the element
- `--id`: The Directus ID of the element to untrack

### Examples

```bash
# Untrack a specific role
npx directus-sync helpers untrack --collection directus_roles --id 123e4567-e89b-12d3-a456-426614174000

# Untrack a flow
npx directus-sync helpers untrack --collection directus_flows --id 987fcdeb-51a2-43d8-b4c1-897d54321000
```

### When to Use

1. **ID Preservation**:
   - Before using `--preserve-ids` option
   - When original IDs need to be maintained

2. **Troubleshooting**:
   - When sync issues occur
   - To reset tracking state

3. **Migration**:
   - When moving elements between instances
   - During major version upgrades

## Remove Permission Duplicates

The `remove-permission-duplicates` command helps clean up duplicate permissions in your Directus instance.

### Usage

```bash
npx directus-sync helpers remove-permission-duplicates [options]
```

### Options

- `--keep <position>`: Which permission to keep (`first` or `last`, default: `last`)

### Example

```bash
# Keep the last permission when duplicates are found
npx directus-sync helpers remove-permission-duplicates --keep last

# Keep the first permission when duplicates are found
npx directus-sync helpers remove-permission-duplicates --keep first
```

### How It Works

1. **Detection**:
   - Identifies permissions with same `role`, `collection`, and `action`
   - Groups duplicate permissions together

2. **Selection**:
   - Keeps either first or last permission based on `--keep` option
   - Preserves all fields of the selected permission

3. **Cleanup**:
   - Removes other duplicate permissions
   - Maintains referential integrity

### When to Use

1. **Data Cleanup**:
   ```bash
   # First, check for duplicates
   npx directus-sync diff
   
   # Then remove duplicates if found
   npx directus-sync helpers remove-permission-duplicates
   ```

2. **Before Migration**:
   ```bash
   # Clean up before pulling
   npx directus-sync helpers remove-permission-duplicates
   
   # Then pull clean data
   npx directus-sync pull
   ```

3. **Troubleshooting**:
   ```bash
   # If permission issues occur
   npx directus-sync helpers remove-permission-duplicates --keep first
   
   # Then retry sync
   npx directus-sync push
   ```

## Best Practices

### Before Using Helpers

1. **Backup**:
   - Take a snapshot of your current state
   - Export any critical data

2. **Verify**:
   - Check current synchronization status
   - Identify specific issues to resolve

3. **Plan**:
   - Determine which helper to use
   - Choose appropriate options

### After Using Helpers

1. **Validate**:
   - Verify changes were applied correctly
   - Check for any side effects

2. **Test**:
   - Ensure functionality still works
   - Verify permissions are correct

3. **Document**:
   - Record what changes were made
   - Note any special considerations

## Common Scenarios

### Resetting Tracking

```bash
# 1. Identify elements to untrack
npx directus-sync diff

# 2. Untrack specific elements
npx directus-sync helpers untrack --collection directus_roles --id <role_id>

# 3. Pull fresh state
npx directus-sync pull
```

### Cleaning Permissions

```bash
# 1. Remove duplicates
npx directus-sync helpers remove-permission-duplicates

# 2. Verify changes
npx directus-sync diff

# 3. Synchronize
npx directus-sync push
```

## Next Steps

- Learn about [advanced features](../advanced/tracked-elements.md)
- Understand [Directus upgrades](../advanced/directus-upgrades.md)
- Explore [troubleshooting](../troubleshooting/firewall-configurations.md) 