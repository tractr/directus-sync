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
import { createDumpFolders } from './helpers';
import { Container } from 'typedi';
import Logger from 'pino';
import { getConfig } from './config';
import { COLLECTIONS_CONFIG, LOGGER, SNAPSHOT_CONFIG } from './constants';

export async function initContext(options: any) {
  // Set temporary logger, in case the config is not loaded yet
  Container.set(LOGGER, Logger({ level: 'info' }));
  // Load the config
  const config = getConfig(options);
  // Define the logger
  Container.set(
    LOGGER,
    Logger({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
      level: config.logger.level,
    }),
  );

  // Define the configs
  Container.set(COLLECTIONS_CONFIG, config.collections);
  Container.set(SNAPSHOT_CONFIG, config.snapshot);

  createDumpFolders(config);
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
