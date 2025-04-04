```text
Options:
  --dump-path <dumpPath>                          the base path for the dump (default "./directus-config")
  --collections-path <collectionPath>             the path for the collections dump, relative to the dump path (default "collections")
  -x, --exclude-collections <excludeCollections>  comma separated list of collections to exclude from the process (default to none)
  -o, --only-collections <onlyCollections>        comma separated list of collections to include in the process (default to all)
  --no-collections                                should pull and push the Directus collections (default "true")
  --snapshot-path <snapshotPath>                  the path for the schema snapshot dump, relative to the dump path (default "snapshot")
  --no-snapshot                                   should pull and push the Directus schema (default "true")
  --no-split                                      should split the schema snapshot into multiple files (default "true")
  -f, --force                                     force the diff of schema, even if the Directus version is different (default "false")
  -h, --help                                      display help for command
```