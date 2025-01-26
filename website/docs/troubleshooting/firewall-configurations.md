---
sidebar_position: 1
---

# Firewall Configurations

When using Directus Sync behind a firewall or proxy, you may need to configure specific settings to ensure proper connectivity.

## Common Issues

### API Access

```bash
# Error when accessing API
Error: connect ETIMEDOUT x.x.x.x:443
```

### Rate Limiting

```bash
# Rate limit exceeded
Error: Request failed with status code 429
```

## Solutions

### Proxy Configuration

```javascript
// directus-sync.config.js
module.exports = {
  client: {
    proxy: {
      host: 'proxy.company.com',
      port: 8080,
      auth: {
        username: 'user',
        password: 'pass'
      }
    }
  }
};
```

### Timeout Settings

```javascript
module.exports = {
  client: {
    timeout: 30000, // 30 seconds
    retry: {
      retries: 3,
      backoff: 1000
    }
  }
};
```

### Rate Limit Configuration

```javascript
module.exports = {
  client: {
    rateLimit: {
      maxRequests: 100,
      perMilliseconds: 60000
    }
  }
};
```

## Best Practices

1. Configure appropriate timeouts
2. Enable request retries
3. Set up rate limiting
4. Use secure proxy settings 