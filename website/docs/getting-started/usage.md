---
sidebar_position: 3
---

# Basic Usage

The CLI is available using the `npx` command.

```shell
npx directus-sync <command> [options]
```

Here's how to use each command in the CLI:

## Commands

### Pull

```shell
npx directus-sync pull
```

Retrieves the current schema and collections from Directus and stores them locally. This command does not modify the database.

It also retrieves the specifications (GraphQL & OpenAPI) and stores them locally. It gets specifications from the `/server/specs/*` endpoints:
- [OpenAPI](https://docs.directus.io/reference/system/server.html#get-openapi-specification)
- [GraphQL SDL (Item & System scopes)](https://docs.directus.io/reference/system/server.html#get-graphql-schema)

### Diff

```shell
npx directus-sync diff
```

Analyzes and describes the difference (diff) between your local schema and collections and the state of the Directus instance. This command is non-destructive and does not apply any changes to the database.

### Push

```shell
npx directus-sync push
```

Applies the changes from your local environment to the Directus instance. This command pushes your local schema and collection configurations to Directus, updating the instance to reflect your local state. 