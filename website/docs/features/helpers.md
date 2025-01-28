---
sidebar_position: 5
---

# Helpers

## Untrack

```shell
npx directus-sync helpers untrack --collection <collection> --id <id>
```

### Parameters

- `--collection`: The collection containing the element
- `--id`: The Directus ID of the element to untrack

### Examples

Untrack a specific role

```bash
npx directus-sync helpers untrack --collection directus_roles --id 123e4567-e89b-12d3-a456-426614174000
```

Untrack a flow

```bash
npx directus-sync helpers untrack --collection directus_flows --id 987fcdeb-51a2-43d8-b4c1-897d54321000
```

Removes tracking from an element within Directus. You must specify the collection and the ID of the element you wish to stop tracking.

## Remove Permission Duplicates

Permissions should be unique regarding the `role`, `collection`, and `action`. Unfortunately, Directus does not enforce this uniqueness. This can lead to unexpected behavior, such as missing ids or other permissions fields. More details can be found in the [Directus issue #21965](https://github.com/directus/directus/issues/21965).

If you have permission duplicates, you can use the following command to remove them:

```shell
npx directus-sync helpers remove-permission-duplicates --keep <keep>
```

- `--keep <keep>`: The permission's position to keep, `first` or `last`. The default is `last`.

This command will keep the `last` (or `first`) permission found and remove the others for each duplicated group `role`, `collection`, and `action`.
