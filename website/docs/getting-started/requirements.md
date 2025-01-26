---
sidebar_position: 1
---

# Requirements

Before you start using Directus Sync, make sure your environment meets the following requirements:

## System Requirements

- Node.js 18 or higher
- A running Directus instance (version 11.x)

## Required Extension

The `directus-extension-sync` extension must be installed on your Directus instance. This extension is essential as it:
- Manages the mapping table between SyncIDs and Directus internal IDs
- Enables tracking of configuration elements
- Facilitates synchronization across environments

### Installing the Extension

1. Install the extension using npm:
```bash
npm install directus-extension-sync
```

2. Restart your Directus instance to activate the extension.

:::tip
The extension needs to be installed on all Directus instances that will be involved in the synchronization process, whether they are source or destination instances.
:::

For more details about the extension, visit the [directus-extension-sync npm package](https://www.npmjs.com/package/directus-extension-sync). 