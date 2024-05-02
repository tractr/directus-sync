import { Container } from 'typedi';
import {
  ConfigService,
  MigrationClient,
  SnapshotClient,
  SpecificationsClient,
} from '../services';
import { loadCollections } from '../loader';
import pino from 'pino';
import { LOGGER } from '../constants';

export async function runPull() {
  const logger: pino.Logger = Container.get(LOGGER);
  const config = Container.get(ConfigService);
  const snapshotConfig = config.getSnapshotConfig();

  // Clear the cache
  await Container.get(MigrationClient).clearCache();

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
