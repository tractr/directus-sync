import { Container } from 'typedi';
import {
  MigrationClient,
  SnapshotClient,
  SpecificationsClient,
} from '../services';
import { loadCollections } from '../loader';

export async function runPull() {
  // Clear the cache
  await Container.get(MigrationClient).clearCache();

  // Snapshot
  await Container.get(SnapshotClient).pull();

  // Specifications
  await Container.get(SpecificationsClient).pull();

  // Collections
  const collections = loadCollections();
  for (const collection of collections) {
    await collection.pull();
  }
  for (const collection of collections) {
    await collection.postProcessPull();
  }
}
