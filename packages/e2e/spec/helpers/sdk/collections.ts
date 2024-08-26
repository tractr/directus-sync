import path from 'path';
import {
  SystemCollection,
  SystemCollectionsContentWithSyncId,
  SystemCollectionsNames,
  SystemCollectionsRecord,
} from './interfaces/index.js';
import fs from 'fs-extra';

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
    collections[key] = collections[key]?.filter(
      (item) => !item._syncId.startsWith('_sync_default_'),
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

export function getDefaultItemsCount(collection: SystemCollection) {
  switch (collection) {
    case 'policies':
      return 2;
    case 'roles':
      return 1;
    default:
      return 0;
  }
}
