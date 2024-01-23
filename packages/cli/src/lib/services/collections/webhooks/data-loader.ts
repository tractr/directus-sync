import { DataLoader } from '../base';

import { Service } from 'typedi';
import { WEBHOOKS_COLLECTION } from './constants';
import path from 'path';
import { DirectusWebhook } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class WebhooksDataLoader extends DataLoader<DirectusWebhook> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${WEBHOOKS_COLLECTION}.json`,
    );
    const hooks = config.getHooksConfig(WEBHOOKS_COLLECTION);
    super(filePath, migrationClient, hooks);
  }
}
