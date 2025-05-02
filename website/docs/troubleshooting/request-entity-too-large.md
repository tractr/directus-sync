---
sidebar_position: 3
---

# Request Entity Too Large Error

When running a diff or push operation with your Directus instance, you might encounter this error:

```json
{
  "errors": [
    {
      "message": "Invalid payload. request entity too large.",
      "extensions": {
        "reason": "request entity too large",
        "code": "INVALID_PAYLOAD"
      }
    }
  ],
  "response": {}
}
```

This error occurs when the schema diff payload exceeds Directus's maximum allowed payload size (default is 1MB). This is particularly common during first-time synchronizations with large collections.

To resolve this issue:

1. Increase the `MAX_PAYLOAD_SIZE` environment variable in your Directus instance configuration. See [Directus Configuration Options](https://directus.io/docs/configuration/security-limits#limits-optimizations) for more details.

2. If you're using a reverse proxy (like Nginx), you may also need to increase the `client_max_body_size` setting. 