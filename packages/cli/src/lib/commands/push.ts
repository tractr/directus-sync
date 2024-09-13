import { Container } from 'typedi';
import pino from 'pino';
import {
  ConfigService,
  MigrationClient,
  PingClient,
  SnapshotClient,
} from '../services';
import { loadCollections } from '../loader';
import { LOGGER } from '../constants';

export async function runPush() {
  const logger: pino.Logger = Container.get(LOGGER);
  const config = Container.get(ConfigService);
  const snapshotConfig = config.getSnapshotConfig();

  // Check and prepare instance
  const migrationClient = Container.get(MigrationClient);
  await migrationClient.validateDirectusVersion();
  await migrationClient.clearCache();

  // Snapshot
  if (snapshotConfig.enabled) {
    // Test if the directus extension is installed
    // At this point, it could be not installed and cause an issue with the snapshot push
    await Container.get(PingClient).test();

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
