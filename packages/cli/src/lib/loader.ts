import { DictionaryValues } from 'ts-essentials';
import {
  CollectionRecord,
  CollectionsList,
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
  ExtensionsCollection,
} from './services';
import { createDumpFolders, getPinoTransport } from './helpers';
import { Container, Token } from 'typedi';
import Logger from 'pino';
import { LOGGER } from './constants';
import pino from 'pino';

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
    flows: FlowsCollection,
    operations: OperationsCollection,
    roles: RolesCollection,
    permissions: PermissionsCollection,
    dashboards: DashboardsCollection,
    panels: PanelsCollection,
    presets: PresetsCollection,
    extensions: ExtensionsCollection,
  } as const satisfies CollectionRecord<unknown>;
  type CollectionInstance = InstanceType<
    DictionaryValues<typeof collectionsConstructors>
  >;

  // Get the collections to process
  const config = Container.get(ConfigService);
  const logger: pino.Logger = Container.get(LOGGER);
  const collectionsToProcess = config.getCollectionsToProcess();
  const excludedCollections = CollectionsList.filter(
    (collection) => !collectionsToProcess.includes(collection),
  );

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

  if (excludedCollections.length > 0) {
    logger.debug(`Excluded collections: ${excludedCollections.join(', ')}`);
  }

  return output;
}
