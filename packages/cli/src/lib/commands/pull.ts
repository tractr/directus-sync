import { Container } from 'typedi';
import {
  ConfigService,
  MigrationClient,
  SnapshotClient,
  SpecificationsClient,
} from '../services';
import { loadCollections } from '../loader';
import { LoggerService } from '../services';

export async function runPull() {
  const logger = Container.get(LoggerService);
  const config = Container.get(ConfigService);
  const snapshotConfig = config.getSnapshotConfig();

  // Check and prepare instance
  const migrationClient = Container.get(MigrationClient);
  await migrationClient.validateDirectusVersion();
  await migrationClient.clearCache();

  // Snapshot
  if (snapshotConfig.enabled) {
    await Container.get(SnapshotClient).pull();
  } else {
    logger.debug('Snapshot is disabled');
  }

  // Specifications
  await Container.get(SpecificationsClient).pull();

  // Collections
  const collections = loadCollections();
  for (const collection of collections) {
    await collection.pull();
  }
  for (const collection of collections) {
    await collection.postProcessPull();
  }
}
