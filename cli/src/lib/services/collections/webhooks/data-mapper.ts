import { DataMapper } from '../base';
import { DirectusWebhook } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { WEBHOOKS_COLLECTION } from './constants';

@Service()
export class WebhooksDataMapper extends DataMapper<DirectusWebhook<object>> {
  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, WEBHOOKS_COLLECTION));
  }
}
