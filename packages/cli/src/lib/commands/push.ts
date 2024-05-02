import { Container } from 'typedi';
import pino from 'pino';
import { ConfigService, MigrationClient, SnapshotClient } from '../services';
import { loadCollections } from '../loader';
import { LOGGER } from '../constants';

export async function runPush() {
  const logger: pino.Logger = Container.get(LOGGER);
  const config = Container.get(ConfigService);
  const snapshotConfig = config.getSnapshotConfig();

  // Clear the cache
  await Container.get(MigrationClient).clearCache();

  // Snapshot
  if (snapshotConfig.enabled) {
    logger.info(`---- Push schema ----`);
    await Container.get(SnapshotClient).push();
  } else {
    logger.debug('Snapshot is disabled');
  }

  // Collections
  const collections = loadCollections();

  // Clean up the collections (dangling id maps, etc.)
  logger.info(`---- Clean up collections ----`);
  for (const collection of collections) {
    await collection.cleanUp();
  }

  // Restore collections until there is nothing to restore
  let stop = false;
  let index = 1;
  while (!stop) {
    logger.info(`---- Push: iteration ${index} ----`);
    stop = true;
    for (const collection of collections) {
      const retry = await collection.push();
      if (retry) {
        stop = false;
      }
    }
    index++;
  }
}
