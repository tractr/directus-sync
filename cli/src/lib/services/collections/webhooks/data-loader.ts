import { DataLoader } from '../base';
import { DirectusWebhook } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { WEBHOOKS_COLLECTION } from './constants';
import path from 'path';
import type { CollectionsConfig } from '../../../config';
import { COLLECTIONS_CONFIG } from '../../../constants';

@Service()
export class WebhooksDataLoader extends DataLoader<DirectusWebhook<object>> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(config.dumpPath, `${WEBHOOKS_COLLECTION}.json`);
    super(filePath);
  }
}
