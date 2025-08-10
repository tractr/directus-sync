import { ValueOf } from 'ts-essentials';
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
  LoggerService,
} from './services';
import { createDumpFolders } from './helpers';
import { Container, Token } from 'typedi';

// eslint-disable-next-line @typescript-eslint/require-await
export async function initContext(
  programOptions: object,
  commandOptions: object,
) {
  // Get the config service
  const config = Container.get(ConfigService);
  // Set the options
  config.setOptions(programOptions, commandOptions);
  // Set the logger level from the config
  Container.get(LoggerService).setLevel(config.getLoggerConfig().level);

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
    ValueOf<typeof collectionsConstructors>
  >;

  // Get the collections to process
  const config = Container.get(ConfigService);
  const logger = Container.get(LoggerService);
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
