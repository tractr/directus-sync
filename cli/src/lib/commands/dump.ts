import { Container } from 'typedi';
import { SnapshotClient } from '../services';
import { loadCollections } from '../loader';

export async function runDump() {
  // Snapshot
  await Container.get(SnapshotClient).dump();

  // Collections
  const collections = loadCollections();
  for (const collection of collections) {
    await collection.dump();
  }
  for (const collection of collections) {
    await collection.postProcessDump();
  }
}
