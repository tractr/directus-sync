---
sidebar_position: 3
---

# Basic Usage

Directus Sync provides three main commands for managing your Directus configurations. Here's how to use each one:

## Pull Command

The `pull` command retrieves the current schema and collections from your Directus instance and stores them locally:

```bash
npx directus-sync pull
```

This command:
- Fetches the current state of your Directus instance
- Stores configurations in JSON format
- Creates or updates tracking IDs for each element
- Does not modify your database

## Diff Command

The `diff` command shows the differences between your local configuration and the Directus instance:

```bash
npx directus-sync diff
```

This command:
- Compares local files with the Directus instance
- Shows what would be created, updated, or deleted
- Is non-destructive (read-only)
- Helps you review changes before applying them

## Push Command

The `push` command applies your local configuration to the Directus instance:

```bash
npx directus-sync push
```

This command:
- Updates your Directus instance to match local files
- Creates new elements as needed
- Updates existing elements
- Removes tracked elements that don't exist locally
- Handles dependencies automatically

## Common Options

These options can be used with any command:

```bash
# Specify configuration file location
npx directus-sync <command> --config-path ./config.js

# Enable debug logging
npx directus-sync <command> --debug

# Include only specific collections
npx directus-sync <command> --only-collections roles,permissions

# Exclude specific collections
npx directus-sync <command> --exclude-collections settings
```

:::tip
You can combine these options as needed. For example:
```bash
npx directus-sync pull --debug --only-collections roles,permissions
```
:::

## Next Steps

- Learn about [seed data management](../features/seed.md)
- Explore [configuration options](../features/configuration.md)
- Understand [how it works](../core-concepts/how-it-works.md) 