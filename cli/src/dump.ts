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
  await Container.get(SnapshotClient).saveSnapshot();

  // Collections
  const collections = loadCollections();
  for (const collection of collections) {
    await collection.dump();
  }
  for (const collection of collections) {
    await collection.postProcessDump();
  }
}

initContext()
  .then(run)
  .catch(logErrorAndStop)
  .then(disposeContext)
  .then(logEndAndClose);
