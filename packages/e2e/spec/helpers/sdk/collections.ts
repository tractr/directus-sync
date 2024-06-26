import path from 'path';
import {
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
    presets: path.join(dumpPath, 'collections', 'presets.json'),
    roles: path.join(dumpPath, 'collections', 'roles.json'),
    settings: path.join(dumpPath, 'collections', 'settings.json'),
    translations: path.join(dumpPath, 'collections', 'translations.json'),
  };
}
export function getDumpedSystemCollectionsContents(dumpPath: string) {
  const paths = getSystemCollectionsPaths(dumpPath);
  return Object.entries(paths).reduce((acc, [key, path]) => {
    return {
      ...acc,
      [key]: fs.existsSync(path) ? fs.readJSONSync(path) : undefined,
    };
  }, {} as SystemCollectionsContentWithSyncId);
}

export function getSystemCollectionsNames(): SystemCollectionsNames {
  return [
    'dashboards',
    'flows',
    'folders',
    'operations',
    'panels',
    'permissions',
    'presets',
    'roles',
    'settings',
    'translations',
  ];
}
