---
sidebar_position: 2
---

# Installation

Directus Sync is available as an npm package and can be run directly using `npx`. There's no need for a global installation.

## Quick Start

You can start using Directus Sync immediately with npx:

```bash
npx directus-sync <command> [options]
```

## Project Setup

While you can run Directus Sync directly with npx, we recommend setting up a project configuration for better control and version management.

1. Create a configuration file in your project root:

```bash
touch directus-sync.config.js
```

2. Add your basic configuration:

```javascript
module.exports = {
  directusUrl: 'https://your-directus-instance.com',
  // Use either token or email/password authentication
  directusToken: 'your-access-token',
  // OR
  directusEmail: 'admin@example.com',
  directusPassword: 'your-password',
  
  // Optional configurations
  dumpPath: './directus-config',
  collectionsPath: 'collections',
  snapshotPath: 'snapshot',
};
```

3. Add convenient scripts to your `package.json`:

```json
{
  "scripts": {
    "sync:pull": "directus-sync pull",
    "sync:diff": "directus-sync diff",
    "sync:push": "directus-sync push"
  }
}
```

## Environment Variables

Instead of hardcoding credentials in your configuration file, you can use environment variables:

```bash
DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_TOKEN=your-access-token
# OR
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=your-password
```

:::tip
Using environment variables is recommended for sensitive information, especially in production environments.
:::

## Next Steps

Once installed, you can:
- Learn about the [basic usage](usage.md) of Directus Sync
- Configure your [synchronization options](../features/configuration.md)
- Start managing your Directus configurations across environments 