import {
  createDumpFolders,
  logEndAndClose,
  logErrorAndStop,
  MigrationClient,
} from './lib';
import { loadCollections } from './lib/loader';

async function run() {
  createDumpFolders();

  const collections = loadCollections();
  for (const collection of collections) {
    await collection.dump();
  }

  await MigrationClient.close();
}

run().then(logEndAndClose).catch(logErrorAndStop);
