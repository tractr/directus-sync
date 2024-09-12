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
  PoliciesCollection,
  PresetsCollection,
  RolesCollection,
  SettingsCollection,
  TranslationsCollection,
} from './services';
import { createDumpFolders, getPinoTransport } from './helpers';
import { Container, Token } from 'typedi';
import Logger from 'pino';
import pino from 'pino';
import { LOGGER } from './constants';

// eslint-disable-next-line @typescript-eslint/require-await
export async function initContext(
  programOptions: object,
  commandOptions: object,
) {
  // Set temporary logger. This allows the config process to log infos and errors
  const tempLogger = Logger({
    transport: getPinoTransport(),
    level: 'info',
  });
  Container.set(LOGGER, tempLogger);
  // Get the config service
  const config = Container.get(ConfigService);
  // Set the options
  config.setOptions(programOptions, commandOptions);
  // Flush previous logs
  tempLogger.flush();
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
    policies: PoliciesCollection,
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
  const logger: pino.Logger = Container.get(LOGGER);
  const collectionsToProcess = config.getCollectionsToProcess();
  const excludedCollections = CollectionsList.filter(
    (collection) => !collectionsToProcess.includes(collection),
  );
  const sortedCollections = Object.keys(
    collectionsConstructors,
  ) as (keyof typeof collectionsConstructors)[];
  const sortedCollectionsToProcess = sortedCollections.filter((collection) =>
    collectionsToProcess.includes(collection),
  );

  // Initialize the collections
  const output: CollectionInstance[] = [];
  for (const collection of sortedCollectionsToProcess) {
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
