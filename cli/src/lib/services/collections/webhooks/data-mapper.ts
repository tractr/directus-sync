import { DataMapper } from '../base';
import { DirectusWebhook } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { FLOWS_COLLECTION } from '../flows';

@Service()
export class WebhooksDataMapper extends DataMapper<DirectusWebhook<object>> {
  constructor(@Inject('logger') baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION));
  }
}
