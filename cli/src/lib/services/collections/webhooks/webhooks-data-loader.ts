import { DataLoader } from '../base';
import { DirectusWebhook } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { WEBHOOKS_COLLECTION } from './constants';
import path from 'path';

@Service()
export class WebhooksDataLoader extends DataLoader<DirectusWebhook<object>> {
  constructor(@Inject('directusDumpPath') dumpPath: string) {
    const filePath = path.join(dumpPath, `${WEBHOOKS_COLLECTION}.json`);
    super(filePath);
  }
}
