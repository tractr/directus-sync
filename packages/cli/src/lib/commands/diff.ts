import { Container } from 'typedi';
import { ConfigService, MigrationClient, SnapshotClient } from '../services';
import { loadCollections } from '../loader';
import pino from 'pino';
import { LOGGER } from '../constants';

export async function runDiff() {
  const logger: pino.Logger = Container.get(LOGGER);
  const config = Container.get(ConfigService);
  const snapshotConfig = config.getSnapshotConfig();

  // Clear the cache
  await Container.get(MigrationClient).clearCache();

  // Snapshot
  if (snapshotConfig.enabled) {
    await Container.get(SnapshotClient).diff();
  } else {
    logger.debug('Snapshot is disabled');
  }

  // Collections
  const collections = loadCollections();
  for (const collection of collections) {
    await collection.diff();
  }
}
