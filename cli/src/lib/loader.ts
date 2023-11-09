import {
  DashboardsCollection,
  FlowsCollection,
  MigrationClient,
  OperationsCollection,
  PanelsCollection,
  PermissionsCollection,
  RolesCollection,
  SettingsCollection,
  WebhooksCollection,
} from './services';
import { createDumpFolders, getDumpFilesPaths } from './helpers';
import { Container } from 'typedi';
import Logger from 'pino';

export async function initContext() {
  // Define the logger
  Container.set(
    'logger',
    Logger({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
      level: 'debug',
    }),
  );
  // Define the dump folders
  Container.set('directusDumpPath', getDumpFilesPaths().dumpDirPath);

  createDumpFolders();
}

export async function disposeContext() {
  await Container.get(MigrationClient).logout();
}

export function loadCollections() {
  // The order of the collections is important
  // The collections are populated in the same order
  return [
    Container.get(SettingsCollection),
    Container.get(WebhooksCollection),
    Container.get(FlowsCollection),
    Container.get(OperationsCollection),
    Container.get(RolesCollection),
    Container.get(PermissionsCollection),
    Container.get(DashboardsCollection),
    Container.get(PanelsCollection),
  ];
}
