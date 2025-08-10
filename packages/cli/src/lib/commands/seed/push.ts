import { Container } from 'typedi';
import {
  ConfigService,
  MigrationClient,
  SeedClient,
  LoggerService,
} from '../../services';

export async function runSeedPush() {
  const logger = Container.get(LoggerService);
  const seedClient = Container.get(SeedClient);

  const config = Container.get(ConfigService);
  const maxPushRetries = config.getPushConfig().maxPushRetries;

  // Check and prepare instance
  const migrationClient = Container.get(MigrationClient);
  await migrationClient.validateDirectusVersion();
  await migrationClient.clearCache();

  // Clean up the seed (dangling id maps, etc.)
  logger.info(`🧹  Clean up seeds`);
  await seedClient.cleanUp();

  let stop = false;
  let index = 1;
  while (!stop) {
    // Check if max retries is reached
    if (maxPushRetries > 0 && index > maxPushRetries) {
      throw new Error(
        `Push: max retries reached after ${maxPushRetries} attempts`,
      );
    }

    logger.info(`⬆️  Push: iteration ${index}`);
    stop = !(await seedClient.push()); // Return true when should retry
    index++;
  }
}
