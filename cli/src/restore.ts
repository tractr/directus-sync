import 'reflect-metadata';
import {
  logEndAndClose,
  logErrorAndStop,
  loadCollections,
  initContext,
  disposeContext,
} from './lib';

async function run() {
  const collections = loadCollections();
  for (const collection of collections) {
    await collection.restore();
  }
}

initContext()
  .then(run)
  .catch(logErrorAndStop)
  .then(disposeContext)
  .then(logEndAndClose);
