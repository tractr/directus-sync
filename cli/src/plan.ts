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
    await collection.plan();
  }
}

initContext()
  .then(run)
  .catch(logErrorAndStop)
  .then(disposeContext)
  .then(logEndAndClose);
