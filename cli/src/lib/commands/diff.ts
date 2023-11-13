import { Container } from 'typedi';
import { SnapshotClient } from '../services';
import { loadCollections } from '../loader';

export async function runDiff() {
  // Snapshot
  await Container.get(SnapshotClient).diff();

  // Collections
  const collections = loadCollections();
  for (const collection of collections) {
    await collection.diff();
  }
}
