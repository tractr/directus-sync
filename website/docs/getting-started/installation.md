---
sidebar_position: 1
---

# Installation

The `directus-extension-sync` is an essential extension required for using the `directus-sync` CLI. It manages the mapping between synchronization identifiers (SyncIDs) and Directus's internal entity IDs.

There are four different ways to install the extension. Choose the one that best fits your setup:

## Option 1: NPM Installation

In your Directus installation root, run:

```bash
npm install directus-extension-sync
```

Then, restart Directus.

## Option 2: Pre-built Docker Image

You can use the pre-built Docker image with this extension pre-installed.

This image is available on Docker Hub: [tractr/directus-sync](https://hub.docker.com/r/tractr/directus-sync).

Example of a Docker Compose stack using Postgres:

```yml
# file: docker-compose.yml
services:
  directus:
    image: tractr/directus-sync:latest
    restart: unless-stopped
    ports:
      - '8055:8055'
    environment:
      KEY: 'XXXXXXXX'
      SECRET: 'XXXXXXXX'
      ADMIN_EMAIL: 'admin@example.com'
      ADMIN_PASSWORD: 'password'
      DB_CLIENT: 'pg'
      DB_HOST: 'postgres'
      DB_PORT: '5432'
      DB_DATABASE: 'directus'
      DB_USER: 'directus'
      DB_PASSWORD: 'password'
    depends_on:
      - postgres

  postgres:
    image: postgis/postgis:15-3.5-alpine
    restart: unless-stopped
    ports:
      - '5432:5432'
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: 'password'
      POSTGRES_USER: 'directus'
      POSTGRES_DB: 'directus'

volumes:
  postgres-data:
    driver: local
```

## Option 3: Custom Docker Image

To build your own Docker image with the extension, follow these steps:

1. Create a file `extensions/package.json` and declare the extensions:

```json
{
  "name": "directus-extensions",
  "dependencies": {
    "directus-extension-sync": "^3.0.2"
  }
}
```

You may add other extensions to the `extensions/package.json` file, depending on your use case.

2. Create a `Dockerfile` to extend the Directus Docker image:

```Dockerfile
FROM node:20-alpine as third-party-ext
RUN apk add python3 g++ make
WORKDIR /extensions
ADD extensions .
RUN npm install
# Move all extensions the starts with directus-extension-, using find, to the /extensions/directus folder
RUN mkdir -p ./directus
RUN cd node_modules && find . -maxdepth 1 -type d -name "directus-extension-*" -exec mv {} ../directus \;

FROM directus/directus:11.10.1
# Copy third party extensions
COPY --from=third-party-ext /extensions/directus ./extensions
```

3. In your `docker-compose.yml`, use this custom image:

```yml
directus:
  build:
    context: .
    dockerfile: Dockerfile
```

You may need to flush the `directus-extensions` table and restart Directus to force it to detect new extensions.

For more details and discussion about this approach, see [this GitHub issue](https://github.com/tractr/directus-sync/issues/63#issuecomment-2096657924).


:::tip
Make sure to use the latest versions of both Directus and the extension. You can check the latest versions on [NPM](https://www.npmjs.com/package/directus-extension-sync) and [Docker Hub](https://hub.docker.com/r/directus/directus).
:::

## Option 4: Directus Marketplace

Unfortunately, the extension is not available in the Directus Marketplace out of the box. Directus Marketplace does not support extensions that require a database connection.

**However**, you can force Directus Marketplace to show all extensions by setting the `MARKETPLACE_TRUST` environment variable to `all`:

```bash
MARKETPLACE_TRUST=all
```

Then, go to the Directus Marketplace and search for the `directus-extension-sync` extension. 