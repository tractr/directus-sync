import 'reflect-metadata';
import {
  disposeContext,
  initContext,
  loadCollections,
  logEndAndClose,
  logErrorAndStop, SnapshotClient,
} from './lib';
import {Container} from "typedi";

async function run() {
  // Snapshot
  await Container.get(SnapshotClient).plan();

  // Collections
  const collections = loadCollections();
  for (const collection of collections) {
    await collection.plan();
  }
}

initContext()
  .then(run)
  .catch(logErrorAndStop)
  .then(disposeContext)
  .then(logEndAndClose);
