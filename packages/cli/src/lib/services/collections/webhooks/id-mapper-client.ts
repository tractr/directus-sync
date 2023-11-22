import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { WEBHOOKS_COLLECTION } from './constants';
import { ConfigService } from '../../config';

@Service()
export class WebhooksIdMapperClient extends IdMapperClient {
  constructor(config: ConfigService) {
    super(config, WEBHOOKS_COLLECTION);
  }
}
