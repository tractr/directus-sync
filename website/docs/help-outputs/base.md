```text
Options:
  -V, --version                               output the version number
  -d, --debug                                 display more logging (default "false")
  -u, --directus-url <directusUrl>            Directus URL (env: DIRECTUS_URL)
  -t, --directus-token <directusToken>        Directus access token (env: DIRECTUS_TOKEN)
  -e, --directus-email <directusEmail>        Directus user email (env: DIRECTUS_ADMIN_EMAIL)
  -p, --directus-password <directusPassword>  Directus user password (env: DIRECTUS_ADMIN_PASSWORD)
  -c, --config-path <configPath>              the path to the config file. Required for extended options (default paths: ./directus-sync.config.js, ./directus-sync.config.cjs, ./directus-sync.config.json)
  -h, --help                                  display help for command

Commands:
  pull [options]                              get the schema and collections and store them locally
  diff [options]                              describe the schema and collections diff. Does not modify the database.
  push [options]                              push the schema and collections
  seed                                        seed the custom collections with data
  helpers                                     a set of helper utilities
  help [command]                              display help for command
```