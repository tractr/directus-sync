---
sidebar_position: 1
---

# Ids Mapping and Tracking

`directus-sync` operates on a tagging system similar to Terraform, where each trackable element within Directus is assigned a unique synchronization identifier (SyncID). This system is key to enabling version control for the configurations and schema within Directus.

## Process

Upon execution of the `pull` command, `directus-sync` will:

1. Scan the specified Directus collections, which include dashboards, flows, folders, operations, panels, permissions, policies, presets, roles, settings and translations.
2. Assign a SyncID to each element within these collections if it doesn't already have one.
3. Commit the data of these collections into code, allowing for versioning and tracking of configuration changes.

This SyncID tagging facilitates the replication of configurations across different instances of Directus while maintaining the integrity and links between different entities.

:::note
The original IDs of the flows are preserved to maintain the URLs of the `webhook` type flows.
The original IDs of the folders are preserved to maintain the associations with fields of the `file` and `image` types.
:::

:::tip
You can use the `--preserve-ids` option to preserve the original ids of some collections.
Eligible collections are collections using UUID: `dashboards`, `operations`, `panels`, `policies`, `roles` and `translations`.
If you have already used the `pull` command, you may use the `untrack` helper to remove the id tracking of an element before using this option.
:::

## Mapping Table

Since it's not possible to add tags directly to entities within Directus, `directus-sync` uses a mapping table that correlates the SyncIDs with the internal IDs used by Directus. This mapping is essential for the synchronization process, as it ensures that each element can be accurately identified and updated across different environments.

This is the main reason why `directus-sync` needs the `directus-extension-sync` extension to be installed on the Directus instances you want to synchronize.

## Non-Tracked Elements and Ignored Fields

Elements that are not meant to be tracked, such as user activities and logs, are not affected by the synchronization process. Certain fields are specifically ignored during synchronization because they are not relevant for version control purposes, such as creation dates and the identity of the user who created an entity.

## Strengths of `directus-sync`

The strength of `directus-sync` lies in its ability to maintain consistent and reproducible configurations across multiple environments. It ensures that only the necessary changes are made, avoiding unnecessary recreation of configurations and maintaining the relationships between tracked and non-tracked entities. This selective updating is what makes `directus-sync` a robust tool for managing Directus instances in a team or multi-environment setup. 