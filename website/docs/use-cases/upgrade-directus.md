---
sidebar_position: 2
---

# Upgrading Directus

When upgrading Directus, it is important to update the configurations pulled by `directus-sync`. Here is a general guide
to upgrading Directus using `directus-sync`:

1. Run Directus on Version **A**: Start with your current Directus setup that is actively running on version **A**.
2. Push Configuration (if needed): Use `npx directus-sync push` to push the latest configurations to your Directus instance. This step ensures that all your current settings are up-to-date on the server.
3. Stop the Directus Server: Shut down your Directus server to prepare for the upgrade.
4. Update to Version **B**: Change the Directus version to **B** in your configuration files or update scripts (e.g., `package.json`, `docker-compose.yml` or `Dockerfile`).
5. Restart and Migrate: Start the Directus server to initiate the upgrade. Directus will automatically run migration scripts necessary to update the database and apply new system configurations.
6. Pull New Configuration: Once Directus is stable on version **B**, execute `npx directus-sync pull` to download the latest configuration snapshot. This action captures any changes or migrations that occurred during the upgrade from version **A** to **B**.
