import { Container } from 'typedi';
import { SnapshotClient } from '../services';
import { loadCollections } from '../loader';

export async function runPull() {
  // Snapshot
  await Container.get(SnapshotClient).pull();

  // Collections
  const collections = loadCollections();
  for (const collection of collections) {
    await collection.pull();
  }
  for (const collection of collections) {
    await collection.postProcessPull();
  }
}
