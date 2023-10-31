import {
  createDumpFolders,
  logEndAndClose,
  logErrorAndStop,
  WebhooksCollection,
} from './lib/index.js';
import { MigrationClient } from './lib/migration-client.js';

async function run() {
  createDumpFolders();

  const webhooks = new WebhooksCollection('webhooks');
  await webhooks.dump();

  await MigrationClient.close();
}

run().then(logEndAndClose).catch(logErrorAndStop);
