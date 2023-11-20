import { Container } from 'typedi';
import pino from 'pino';
import { SnapshotClient } from '../services';
import { loadCollections } from '../loader';
import { LOGGER } from '../constants';

export async function runPush() {
  const logger = Container.get(LOGGER) ;

  // Snapshot
  logger.info(`---- Push schema ----`);
  await Container.get(SnapshotClient).push();

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
