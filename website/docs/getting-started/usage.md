---
sidebar_position: 2
---

# Quick Start Guide

:::important
Before starting, make sure you have installed the `directus-extension-sync` extension on all Directus instances you want to synchronize. This extension is required for the tool to work properly.
You can learn more about the extension in the [installation section](installation.md).
:::

## 1. Authentication of the Directus Sync CLI

Directus Sync CLI communicates with your Directus instance using the API.
Therefore, it has to be authenticated as an **admin user**.

To do so, you can provide credentials or an API token.

### Using Credentials

This method is useful for development purposes.

```shell
npx directus-sync pull \
  --directus-url https://your-instance.directus.com \
  --directus-email admin@example.com \
  --directus-password your-password
```

### Using API Token

To get started, you need to create an API token for an admin user in your Directus instance:

```shell
npx directus-sync pull \
  --directus-url https://your-instance.directus.com \
  --directus-token your-token
```

:::tip
If you don't know how to create an API token, you can refer to the [this article](https://learndirectus.com/how-to-create-an-api-authentication-token/) for more information.
:::

:::note
In the next sections, we will use the API token for authentication, but you can use the credentials method instead.
:::

## 2. Pull Configuration

To retrieve the current configuration from your Directus instance:

```shell
npx directus-sync pull \
  --directus-url https://your-instance.directus.com \
  --directus-token your-token
```

This command will:
- Retrieve the current schema
- Save collections and their configurations
- Store everything locally in the `directus-config` folder

It also retrieves the specifications (GraphQL & OpenAPI) from the `/server/specs/*` endpoints:
- [OpenAPI](https://docs.directus.io/reference/system/server.html#get-openapi-specification)
- [GraphQL SDL (Item & System scopes)](https://docs.directus.io/reference/system/server.html#get-graphql-schema)

## 3. Check Differences (diff)

To check differences between your local configuration and another instance:

```shell
npx directus-sync diff \
  --directus-url https://other-instance.directus.com \
  --directus-token other-token
```

This command is non-destructive and shows you:
- Elements that will be created
- Elements that will be updated
- Elements that will be deleted

## 4. Apply Changes (push)

To apply changes to your target instance:

```shell
npx directus-sync push --directus-url https://other-instance.directus.com --directus-token other-token
```

This command will:
- Synchronize the schema
- Update collections
- Handle dependencies between elements

## Advanced Configuration

For more advanced configuration, you can create a `directus-sync.config.js` file at the root of your project to avoid specifying parameters each time:

```javascript
module.exports = {
  directusUrl: 'https://your-instance.directus.com',
  directusToken: 'your-token',
  dumpPath: './directus-config'
}
```

For more information, you can refer to the [configuration section](../features/configuration.mdx).
