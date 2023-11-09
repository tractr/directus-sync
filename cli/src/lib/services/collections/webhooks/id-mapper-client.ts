import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { WEBHOOKS_COLLECTION } from './constants';

@Service()
export class WebhooksIdMapperClient extends IdMapperClient {
  constructor() {
    super(WEBHOOKS_COLLECTION);
  }
}
