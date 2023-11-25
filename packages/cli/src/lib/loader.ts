import {
  ConfigService,
  DashboardsCollection,
  FlowsCollection,
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
import { LOGGER } from './constants'; // eslint-disable-next-line @typescript-eslint/require-await

// eslint-disable-next-line @typescript-eslint/require-await
export async function initContext(
  programOptions: object,
  commandOptions: object,
) {
  // Set temporary logger, in case of error when loading the config
  Container.set(
    LOGGER,
    Logger({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
      level: 'error',
    }),
  );
  // Get the config service
  const config = Container.get(ConfigService);
  // Set the options
  config.setOptions(programOptions, commandOptions);
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
      level: config.getLoggerConfig().level,
    }),
  );

  createDumpFolders();
}

export function disposeContext() {
  // Close some services if needed
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
