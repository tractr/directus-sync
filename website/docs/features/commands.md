---
sidebar_position: 1
---

# Available Commands

Directus Sync provides a set of powerful commands to manage your Directus configurations. Each command can be customized with various options to suit your needs.

## Core Commands

### Pull

```bash
npx directus-sync pull [options]
```

Retrieves the current state from your Directus instance:
- Downloads schema snapshot
- Fetches collection configurations
- Creates tracking IDs for new elements
- Stores everything locally

### Diff

```bash
npx directus-sync diff [options]
```

Shows differences between local files and Directus instance:
- Compares schemas
- Identifies configuration changes
- Lists new, modified, and deleted elements
- Non-destructive operation

### Push

```bash
npx directus-sync push [options]
```

Applies local changes to your Directus instance:
- Updates schema if needed
- Creates new elements
- Updates modified elements
- Removes deleted elements
- Handles dependencies automatically

## Common Options

All commands support these options:

```bash
Options:
  -c, --config-path <path>        Path to config file
  -d, --debug                     Enable debug logging
  -u, --directus-url <url>        Directus instance URL
  -t, --directus-token <token>    Access token
  -e, --directus-email <email>    Admin email (if no token)
  -p, --directus-password <pass>  Admin password (if no token)
  --dump-path <path>              Base path for dumps
  --collections-path <path>       Collections dump path
  --snapshot-path <path>          Schema snapshot path
  --specs-path <path>            API specs dump path
  -h, --help                     Display help
```

## Collection Management

### Include/Exclude Collections

```bash
# Include only specific collections
npx directus-sync pull --only-collections roles,permissions

# Exclude specific collections
npx directus-sync pull --exclude-collections settings
```

### ID Preservation

```bash
# Preserve IDs for specific collections
npx directus-sync pull --preserve-ids roles,panels

# Preserve all possible IDs
npx directus-sync pull --preserve-ids all
```

## Schema Options

```bash
# Skip schema operations
npx directus-sync pull --no-snapshot

# Keep schema in single file
npx directus-sync pull --no-split

# Skip API specs
npx directus-sync pull --no-specs
```

## Advanced Usage

### Force Mode

```bash
# Force diff even with version mismatch
npx directus-sync diff --force
```

### Retry Configuration

```bash
# Set maximum push retries
npx directus-sync push --max-push-retries 30
```

## Environment Variables

Instead of command-line options, you can use environment variables:

```bash
DIRECTUS_URL=https://directus.example.com
DIRECTUS_TOKEN=your-token
# OR
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=your-password
```

## Examples

### Basic Workflow

```bash
# Pull current state
npx directus-sync pull

# Check differences
npx directus-sync diff

# Apply changes
npx directus-sync push
```

### Targeted Sync

```bash
# Pull only roles and permissions
npx directus-sync pull --only-collections roles,permissions --debug

# Check specific changes
npx directus-sync diff --only-collections roles,permissions

# Push selected changes
npx directus-sync push --only-collections roles,permissions
```

## Next Steps

- Learn about [seed data management](seed.md)
- Configure using [configuration files](configuration.md)
- Implement [custom hooks](hooks.md) 