import { DictionaryValues } from 'ts-essentials';
import {
  CollectionRecord,
  ConfigService,
  DashboardsCollection,
  FlowsCollection,
  FoldersCollection,
  OperationsCollection,
  PanelsCollection,
  PermissionsCollection,
  PresetsCollection,
  RolesCollection,
  SettingsCollection,
  TranslationsCollection,
  WebhooksCollection,
} from './services';
import { createDumpFolders, getPinoTransport } from './helpers';
import { Container, Token } from 'typedi';
import Logger from 'pino';
import { LOGGER } from './constants';

// eslint-disable-next-line @typescript-eslint/require-await
export async function initContext(
  programOptions: object,
  commandOptions: object,
) {
  // Set temporary logger, in case of error when loading the config
  Container.set(
    LOGGER,
    Logger({
      transport: getPinoTransport(),
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
      transport: getPinoTransport(),
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
  const collectionsConstructors = {
    settings: SettingsCollection,
    folders: FoldersCollection,
    translations: TranslationsCollection,
    webhooks: WebhooksCollection,
    flows: FlowsCollection,
    operations: OperationsCollection,
    roles: RolesCollection,
    permissions: PermissionsCollection,
    dashboards: DashboardsCollection,
    panels: PanelsCollection,
    presets: PresetsCollection,
  } as const satisfies CollectionRecord<unknown>;
  type CollectionInstance = InstanceType<
    DictionaryValues<typeof collectionsConstructors>
  >;

  // Get the collections to process
  const config = Container.get(ConfigService);
  const collectionsToProcess = config.getCollectionsToProcess();

  // Initialize the collections
  const output: CollectionInstance[] = [];
  for (const collection of collectionsToProcess) {
    const collectionConstructor = collectionsConstructors[collection];
    output.push(
      Container.get(
        collectionConstructor as Token<
          InstanceType<typeof collectionConstructor>
        >,
      ),
    );
  }

  return output;
}
