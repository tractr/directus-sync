---
sidebar_position: 7
---

# Cache clearing after Directus upgrades

When upgrading Directus, schema-related caches can persist and cause stale metadata (e.g., old FK constraint names).

Directus Sync now clears both the regular cache and, when available in your Directus version/SDK, the system cache at the start of `pull`, `diff`, `push`, and `seed` commands. This is best-effort; older Directus releases may not expose the system-cache endpoint.

If you still observe stale schema behavior after upgrade, try clearing caches directly in Directus admin (Settings → System → Cache) and re-run the command.

References: [Issue #135](https://github.com/tractr/directus-sync/issues/135)


