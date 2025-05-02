---
sidebar_position: 4
---

# Large Data Sets Errors

## Error 431: Request Header Fields Too Large

When working with large collections (thousands of items), you might encounter errors related to large request headers or data sets:

```
[MyCollection] Error querying batch size 500: 431 Request Header Fields Too Large
```

This error occurs when processing large data sets during operations like `seed push`. The problem arises when `getDanglingIds()` internally calls `queryByPrimaryField([...ids])` with a very large list of IDs, causing the request headers to exceed size limits.

### Symptoms

- Items unexpectedly deleted during sync operations
- Error logs showing status 431 (Request Header Fields Too Large)
- Message like: `[MyCollection] Removed 4800 dangling items`

### Causes

When the ID list becomes too large, the Directus API may return a Response object with error code 431 instead of the expected array of items. The sync tool may not properly recognize this as an error and might:

1. Incorrectly assume none of the items exist in the database
2. Delete them as "dangling" items, resulting in data loss

### Solutions

1. Increase the [`QUERY_LIMIT_MAX`](https://directus.io/docs/configuration/security-limits#limits-optimizations) environment variable in your Directus configuration. This directly addresses the issue by allowing Directus to handle larger queries.

3. If running in Docker or behind a proxy, make sure your web server isn't imposing additional limits:
   - For Nginx: Increase `large_client_header_buffers` setting
   - For Apache: Adjust `LimitRequestFieldSize` and `LimitRequestFields` directives
