# `directus-extension-sync`

The `directus-sync` CLI provides a set of tools for managing and synchronizing the schema and
collections within Directus across different environments.
It allows to synchronize the following
elements: `dashboards`, `flows`, `folders`, `operations`, `panels`, `permissions`, `presets`, `roles`, `settings`, `translations`
and `webhooks`.

More information about the `directus-sync` CLI tool can be found [here](https://github.com/tractr/directus-sync).

## Overview

The `directus-extension-sync` is an essential extension required for using the `directus-sync` CLI. It manages the
mapping between synchronization identifiers (SyncIDs) and Directus's internal entity IDs. This extension
allows `directus-sync` to perform version control and synchronization tasks across various Directus instances.

## Features

- **ID Mapping**: Maintains a mapping table linking SyncIDs with Directus's internal IDs.
- **Initialization**: Automatically creates the mapping table upon first use.
- **CRUD Operations**: Provides endpoints to create, read, update, and delete mappings.

## Installation

In your Directus installation root, run:

```bash
npm install directus-extension-sync
```

Then, restart Directus.

## Usage

The extension provides a set of RESTful endpoints that are used internally by the `directus-sync` tool to manage
SyncIDs. These endpoints include:

- `GET /directus-extension-sync/table/:table/sync_id/:sync_id`: Retrieve a mapping by SyncID.
- `GET /directus-extension-sync/table/:table/local_id/:local_id`: Retrieve a mapping by local ID.
- `GET /directus-extension-sync/table/:table`: Retrieve all mappings for a table.
- `POST /directus-extension-sync/table/:table`: Create a new mapping entry.
- `DELETE /directus-extension-sync/table/:table/sync_id/:sync_id`: Remove a mapping by SyncID.
- `DELETE /directus-extension-sync/table/:table/local_id/:local_id`: Remove a mapping by local ID.

### Helpers

- `DELETE /directus-extension-sync/helpers/permissions/duplicates`: Remove conflicts in permissions when there are
  duplicated groups "role + collection + action".

## Development

Link the package to a development Directus instance:

```bash
npm run link /path/to/directus/extensions
```

The run in development mode:

```bash
npm run dev
```