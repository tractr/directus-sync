import {DataLoader} from '../base';

import {Inject, Service} from 'typedi';
import {WEBHOOKS_COLLECTION} from './constants';
import path from 'path';
import type {CollectionsConfig} from '../../../config';
import {COLLECTIONS_CONFIG} from '../../../constants';
import {DirectusWebhook} from "./interfaces";

@Service()
export class WebhooksDataLoader extends DataLoader<DirectusWebhook> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(config.dumpPath, `${WEBHOOKS_COLLECTION}.json`);
    super(filePath);
  }
}
