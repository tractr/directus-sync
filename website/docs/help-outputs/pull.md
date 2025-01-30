```text
Options:
  --dump-path <dumpPath>                          the base path for the dump (default "./directus-config")
  --collections-path <collectionPath>             the path for the collections dump, relative to the dump path (default "collections")
  -x, --exclude-collections <excludeCollections>  comma separated list of collections to exclude from the process (default to none)
  -o, --only-collections <onlyCollections>        comma separated list of collections to include in the process (default to all)
  --preserve-ids <preserveIds>                    comma separated list of collections that preserve their original ids (default to none). Use "*" or "all" to preserve all ids, if applicable.
  --snapshot-path <snapshotPath>                  the path for the schema snapshot dump, relative to the dump path (default "snapshot")
  --no-snapshot                                   should pull and push the Directus schema (default "true")
  --no-split                                      should split the schema snapshot into multiple files (default "true")
  --specs-path <specsPath>                        the path for the specifications dump (GraphQL & OpenAPI), relative to the dump path (default "specs")
  --no-specs                                      should dump the GraphQL & OpenAPI specifications (default "true")
  -h, --help                                      display help for command
```