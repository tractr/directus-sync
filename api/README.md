# `directus-extension-sync`

## Overview

The `directus-extension-sync` is an extension that manages the mapping between
synchronization identifiers (SyncIDs) and Directus's internal entity IDs. This extension is a critical dependency for
the `directus-sync` CLI tool, enabling it to perform version control and synchronization tasks across different Directus
instances.

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

## Development

Link the package to a development Directus instance:

```bash
npm run link /path/to/directus/extensions
```

The run in development mode:

```bash
npm run dev
```
