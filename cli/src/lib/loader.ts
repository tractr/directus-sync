import { WebhooksCollection } from './services';
import { createDumpFolders, getDumpFilesPaths } from './helpers';
import { Container } from 'typedi';
import { MigrationClient } from './services';
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
  return [Container.get(WebhooksCollection)];
}
