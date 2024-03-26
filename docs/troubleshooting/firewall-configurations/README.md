# Synchronization Failures Due to Firewall Configurations

Some requests made by `directus-sync`, particularly during the **diff** process, can be blocked by certain firewall
configurations.
You should see this log message if this is the case:

```text
[12:40:43.095] ERROR (54159): [snapshot] Could not get the diff from the Directus instance
```

Check and adjust your firewall settings to ensure they don't block or interfere with directus-sync operations.
This may involve whitelisting IP addresses or modifying rules to allow the necessary request patterns.
More information in this [issue](https://github.com/tractr/directus-sync/issues/33).
