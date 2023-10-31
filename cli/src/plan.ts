import {createDumpFolders, logEndAndClose, logErrorAndStop, MigrationClient, WebhooksCollection,} from './lib';

async function run() {
    createDumpFolders();

    const webhooks = new WebhooksCollection('webhooks');
    await webhooks.plan();

    await MigrationClient.close();
}

run().then(logEndAndClose).catch(logErrorAndStop);
