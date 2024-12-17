# Directus Sync

![Directus 11.3.4](https://img.shields.io/badge/Directus-11.3.4-64f?style=for-the-badge&logo=directus)
[![Donate](https://liberapay.com/assets/widgets/donate.svg)](https://liberapay.com/Directus-Sync/donate)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=for-the-badge&logo=discord)](https://discord.gg/4vGzHPQmud)

> [!IMPORTANT]
> **Documentation**: Check the [documentation](https://github.com/tractr/directus-sync/blob/main/DOCUMENTATION.md) for detailed
> information. You **need to install** the required Directus extension `directus-extension-sync` on your Directus instance to
> use Directus-Sync. Follow the installation instructions in the [directus-extension-sync documentation](https://github.com/tractr/directus-sync/tree/main/packages/api#directus-extension-sync).

> [!NOTE]
> **Donate**: If Directus Sync is enhancing your team's productivity in a commercial setting, please consider supporting our project
> financially. More information in the [Donate](#donate) section.

## Overview

Directus Sync is a powerful CLI tool that enables seamless synchronization and versioning of configurations across
multiple Directus instances. It addresses the critical need for maintaining consistent setups across development,
staging, production, and any number of additional environments.

By facilitating easy configuration transfers between instances and providing version control, Directus Sync streamlines
workflows and enhances collaboration for teams managing Directus deployments.

## Why use Directus-Sync?

- **Simplified Deployment**: Easily deploy configuration changes from one environment to another.
- **Code-First Approach**: Manage your Directus schema, roles, and permissions through code, improving maintainability
  and enabling automated testing.
- **Version Control**: Version your Directus configurations like code, allowing for change tracking and easy rollbacks.

## Key features

- **Full Collections Support**: Tracks dashboards, flows, folders, operations, panels, permissions, policies, presets,
  roles, settings, and translations.
- **Selective & Granular Synchronization**: Include or exclude specific collections during sync operations. Enables
  precise configuration synchronization between Directus instances.
- **Hooks System**: Customize the synchronization process using hooks for collections and snapshots.
- **Original ID Preservation**: Offers the ability to preserve original IDs for certain collections.
- **Sync ID Tracking**: Uses unique synchronization IDs (SyncIDs) to track configurations across instances.
- **Built-in Dependency Management**: Handles complex dependencies, including circular ones, between configurations.
- **Automated Testing**: Includes end-to-end and unit testing to ensure reliability and compatibility.

## Installation

To use Directus Sync, you need to install the required Directus extension `directus-extension-sync` on your Directus
instance.

Follow the installation instructions in
the [directus-extension-sync documentation](https://github.com/tractr/directus-sync/blob/main/packages/api/README.md#installation).

## Usage

### Basic Commands

- `npx directus-sync pull`: Retrieve configurations from a Directus instance
- `npx directus-sync diff`: Compare local configurations with a Directus instance
- `npx directus-sync push`: Apply local configurations to a Directus instance

### Configuration

Create a `directus-sync.config.js` file in your project root to configure Directus Sync. Example:

```jsx
module.exports = {
    directusUrl: 'https://your-directus-instance.com',
    directusToken: 'your-access-token',
    dumpPath: './directus-config',
    // Additional options...
};
```

For detailed configuration options, refer to the [full documentation](https://github.com/tractr/directus-sync/blob/main/DOCUMENTATION.md).

## Roadmap

We're constantly working to improve Directus Sync. Some features we're considering for future releases:

- TypeScript support, enabling type-safe schema and configuration definitions
- Database seeding functionality to easily populate your Directus instances with initial or test data
- Improved handling of custom data synchronization

We value your input! Help shape the future of Directus Sync by sharing your experience and suggestions. Please take a
moment to complete our [feedback form](https://forms.gle/LnaB89uVkZCDqRfGA). Your insights are crucial in guiding our
development priorities and ensuring Directus Sync continues to meet your needs.

## Contributing

We welcome contributions to Directus Sync! Please check
our [contribution guidelines](https://github.com/tractr/directus-sync/blob/main/CONTRIBUTING.md) for more information on
how to get involved.

## Donate

### For individual developers

If you're a solo developer or using Directus Sync for personal projects, please enjoy the tool without any consideration
to donate. There are other ways you can support like **starring our repository, share your experience** with Directus
Sync in your network or **provide feedback thanks to** our [feedback form](https://forms.gle/LnaB89uVkZCDqRfGA).

### For companies and commercial users

If Directus Sync is enhancing your team's productivity in a commercial setting, **please consider supporting our project
financially**. Your contributions enable us to dedicate more time to feature development, ensure long-term maintenance,
and potentially provide priority support. Even small donations can significantly impact our ability to improve and
expand the tool. By supporting Directus Sync, **you're investing in your team's efficiency** and the project's future.

[![Donate](https://liberapay.com/assets/widgets/donate.svg)](https://liberapay.com/Directus-Sync/donate)

## Support

If you encounter any issues or have questions, please:

1. Check the [documentation](https://github.com/tractr/directus-sync/blob/main/DOCUMENTATION.md) for detailed
   information.
2. Search existing [issues](https://github.com/tractr/directus-sync/issues) for similar problems.
3. If you can't find a solution, open a new issue with a detailed description of the problem.
