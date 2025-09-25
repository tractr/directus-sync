import path from 'path';
import {
  SystemCollectionsContentWithSyncId,
  SystemCollectionsNames,
  SystemCollectionsRecord,
  Schema,
} from './interfaces/index.js';
import fs from 'fs-extra';
import { notDefaultSettings } from './helpers.js';

import { DirectusSettings } from '@directus/sdk';

export function getSystemCollectionsPaths(
  dumpPath: string,
): SystemCollectionsRecord<string> {
  return {
    dashboards: path.join(dumpPath, 'collections', 'dashboards.json'),
    flows: path.join(dumpPath, 'collections', 'flows.json'),
    folders: path.join(dumpPath, 'collections', 'folders.json'),
    operations: path.join(dumpPath, 'collections', 'operations.json'),
    panels: path.join(dumpPath, 'collections', 'panels.json'),
    permissions: path.join(dumpPath, 'collections', 'permissions.json'),
    policies: path.join(dumpPath, 'collections', 'policies.json'),
    presets: path.join(dumpPath, 'collections', 'presets.json'),
    roles: path.join(dumpPath, 'collections', 'roles.json'),
    settings: path.join(dumpPath, 'collections', 'settings.json'),
    translations: path.join(dumpPath, 'collections', 'translations.json'),
  };
}
export function getDumpedSystemCollectionsContents(
  dumpPath: string,
  keepDefault = false,
) {
  const paths = getSystemCollectionsPaths(dumpPath);
  const collections = Object.entries(paths).reduce((acc, [key, path]) => {
    return {
      ...acc,
      [key]: fs.existsSync(path) ? fs.readJSONSync(path) : undefined,
    };
  }, {} as SystemCollectionsContentWithSyncId);
  return keepDefault
    ? collections
    : excludeDefaultSystemCollectionsEntries(collections);
}

export function excludeDefaultSystemCollectionsEntries(
  collections: SystemCollectionsContentWithSyncId,
) {
  const keys = Object.keys(
    collections,
  ) as (keyof SystemCollectionsContentWithSyncId)[];
  for (const key of keys) {
    // Consider settings as default from its properties, not its sync id
    if (key === 'settings') {
      collections[key] = (
        collections[key] as DirectusSettings<Schema>[]
      )?.filter(notDefaultSettings) as any;
      continue;
    }

    // For roles and policies, consider them as default from their sync id
    collections[key] = collections[key]?.filter(
      (item) => !item._syncId.startsWith('_sync_default_'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;
  }
  return collections;
}

export function getSystemCollectionsNames(): SystemCollectionsNames {
  return [
    'dashboards',
    'flows',
    'folders',
    'operations',
    'panels',
    'permissions',
    'policies',
    'presets',
    'roles',
    'settings',
    'translations',
  ];
}

/**
 * Use `countSingleton` to excludes the settings from this count as it is a singleton collection
 */
export function getDefaultItemsCount(
  collection: string,
  countSingleton = false,
) {
  switch (collection) {
    case 'policies':
      return 2;
    case 'roles':
      return 1;
    case 'settings':
      return countSingleton ? 1 : 0;
    default:
      return 0;
  }
}

/**
 * Returns true if the collection is a singleton collection with default items
 */
export function isSingletonCollectionWithDefault(collection: string) {
  return collection === 'settings';
}
