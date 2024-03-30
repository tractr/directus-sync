import path from 'path';
import { CollectionsRecord } from './interfaces';
import { existsSync } from 'fs-extra';

export function getCollectionsPaths(dumpPath: string): CollectionsRecord<string> {
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
    webhooks: path.join(dumpPath, 'collections', 'webhooks.json'),
  };
}
export function getCollectionsContents(dumpPath: string) {
  const paths = getCollectionsPaths(dumpPath);
  return Object.entries(paths).reduce((acc, [key, path]) => {
    return {
      ...acc,
      [key]: existsSync(path)  ? require(path) : undefined,
    };
  }, {} as CollectionsRecord<object[]>);
}
