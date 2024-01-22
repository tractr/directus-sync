import { DataLoader } from '../base';

import { Service } from 'typedi';
import { WEBHOOKS_COLLECTION } from './constants';
import path from 'path';
import { DirectusWebhook } from './interfaces';
import { ConfigService } from '../../config';

@Service()
export class WebhooksDataLoader extends DataLoader<DirectusWebhook> {
  constructor(config: ConfigService) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${WEBHOOKS_COLLECTION}.json`,
    );
    const transformDataHooks = config.getHooksConfig(WEBHOOKS_COLLECTION);
    super(filePath, transformDataHooks);
  }
}
