import 'reflect-metadata';
import {
  disposeContext,
  initContext,
  loadCollections,
  logEndAndClose,
  logErrorAndStop,
} from './lib';

async function run() {
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
