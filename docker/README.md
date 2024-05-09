# Docker image

This Docker image extends the official Directus Docker images with the extension `directus-extension-sync` pre-installed.

It can be used to quickly set up a Directus instance to use with the [`directus-sync` CLI](https://github.com/tractr/directus-sync).

The `directus-sync` command-line interface (CLI) provides a set of tools for managing and synchronizing the schema and collections within Directus across different environments.

## Usage

### Run with Docker Compose

Create a `docker-compose.yml` file with the following content:

```yaml
version: '3.8'

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
```

Then, run:

```bash
docker-compose up -d
```

### Run with Docker

Run the following command:

```bash
docker run -d -p 8055:8055 \
    -e KEY=XXXXXXXX \
    -e SECRET=XXXXXXXX \
    -e ADMIN_EMAIL=admin@example.com \
    -e ADMIN_PASSWORD=password \
    tractr/directus-sync:latest
```

