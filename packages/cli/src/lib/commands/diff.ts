import { Container } from 'typedi';
import { MigrationClient, SnapshotClient } from '../services';
import { loadCollections } from '../loader';

export async function runDiff() {
  // Clear the cache
  await Container.get(MigrationClient).clearCache();
  // Snapshot
  await Container.get(SnapshotClient).diff();

  // Collections
  const collections = loadCollections();
  for (const collection of collections) {
    await collection.diff();
  }
}
