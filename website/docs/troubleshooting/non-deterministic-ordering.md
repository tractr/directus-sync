---
sidebar_position: 4
---

# Non-Deterministic Ordering in Diffs

## Unexpected diffs caused by inconsistent element ordering

When running a diff or pull operation, you might notice that certain collections (such as `operations` inside
flows) produce unexpected changes every time, even when nothing has actually been modified. This typically
looks like elements being shown as removed and re-added in a different order.

This happens because the Directus API does not guarantee a consistent ordering when returning lists of
elements. If multiple elements share the same key/value pair (e.g. the `key` field in `operations`),
`directus-sync` may store them in a different order on each run, resulting in noisy diffs.

## Solutions

### Option 1: Sort elements on save using `onSave`

You can use the `onSave` [collection hook](https://tractr.github.io/directus-sync/docs/features/hooks#collections-hooks)
to sort elements in a deterministic order before they are written to the sync files.

For example, to sort `operations` by their `key` field:

```js
module.exports = {
  hooks: {
    collections: {
      operations: {
        onSave: (elements) => {
          return elements.sort((a, b) => {
            if (a.key < b.key) return -1;
            if (a.key > b.key) return 1;
            return 0;
          });
        },
      },
    },
  },
};
```

This ensures that the sync files always store elements in a consistent order, preventing spurious diffs on
subsequent runs.

### Option 2: Sort elements at query time using `onQuery`

Alternatively, you can use the `onQuery` [collection hook](https://tractr.github.io/directus-sync/docs/features/hooks#collections-hooks)
to modify the query sent to the Directus API, requesting elements in a specific order from the start.

```js
module.exports = {
  hooks: {
    collections: {
      operations: {
        onQuery: (query) => {
          return {
            ...query,
            sort: ['key'],
          };
        },
      },
    },
  },
};
```

:::note
**Note:** By default, `directus-sync` fetches all elements without specifying any sort order. This option
enforces ordering at the API level, which can be slightly more efficient.
:::

For a practical example of using hooks to control which elements are processed, see
[Filtering out elements](https://tractr.github.io/directus-sync/docs/features/hooks#filtering-out-elements).

:::info
Reference: [Issue #189](https://github.com/tractr/directus-sync/issues/189)
:::
