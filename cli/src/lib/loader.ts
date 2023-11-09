import {
  MigrationClient,
  SettingsCollection,
  WebhooksCollection,
} from './services';
import { createDumpFolders, getDumpFilesPaths } from './helpers';
import { Container } from 'typedi';
import Logger from 'pino';
import { OperationsCollection } from './services/collections/operations';
import { FlowsCollection } from './services/collections/flows';
import {RolesCollection} from "./services/collections/roles";

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
  ];
}
