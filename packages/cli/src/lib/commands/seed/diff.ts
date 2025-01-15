import { Container } from 'typedi';
import { MigrationClient, SeedClient } from '../../services';

export async function runSeedDiff() {
  const seedClient = Container.get(SeedClient);

  // Check and prepare instance
  const migrationClient = Container.get(MigrationClient);
  await migrationClient.validateDirectusVersion();
  await migrationClient.clearCache();

  // Load and diff seeds
  await seedClient.diff();
}
