---
sidebar_position: 1
---

# Introduction

![Directus 11.4.0](https://img.shields.io/badge/Directus-11.4.0-64f?style=for-the-badge&logo=directus)

:::important
Latest version of `directus-sync` introduces breaking changes and is not compatible with Directus 10.x.x.
If you are using Directus 10.x.x, please run `npx directus-sync@2.2.0`
:::

:::note
Help us improve Directus Sync by sharing your feedback! Take a quick survey about your usage here: https://forms.gle/LnaB89uVkZCDqRfGA
:::

The `directus-sync` command-line interface (CLI) provides a set of tools for managing and synchronizing the schema and
collections within Directus across different environments.

## Key Features

- **API-Driven Synchronization**: Leverages Directus's REST API for high-fidelity operations that align with native application actions.
- **Granular Updates**: Focuses on differential data changes rather than complete table overwrites, preserving data integrity and history.
- **Organized Backups**: Separates backups into multiple files for improved readability and version control.
- **Tracked Elements**: Manages various Directus elements including dashboards, flows, folders, operations, panels, permissions, policies, presets, roles, settings, and translations.

## Why Directus Sync?

Directus Sync was created to solve the common challenge of maintaining consistent configurations across multiple Directus environments. Whether you're working with development, staging, or production environments, Directus Sync ensures that your schema, collections, and configurations remain synchronized and version-controlled.

## Next Steps

- Follow the [Installation](getting-started/installation.md) guide to set up Directus Sync
- Learn about the basic [Usage](getting-started/usage.md) and available commands
