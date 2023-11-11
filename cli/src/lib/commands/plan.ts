import { Container } from 'typedi';
import { SnapshotClient } from '../services';
import { loadCollections } from '../loader';

export async function runPlan() {
  // Snapshot
  await Container.get(SnapshotClient).plan();

  // Collections
  const collections = loadCollections();
  for (const collection of collections) {
    await collection.plan();
  }
}
