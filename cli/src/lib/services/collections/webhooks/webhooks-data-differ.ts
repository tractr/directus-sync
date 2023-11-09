import { DataDiffer } from '../base';
import { DirectusWebhook } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { WEBHOOKS_COLLECTION } from './constants';
import pino from 'pino';
import { WebhooksDataLoader } from './webhooks-data-loader';
import { WebhooksDataClient } from './webhooks-data-client';
import { WebhooksIdMapperClient } from './webhooks-id-mapper-client';
import { getChildLogger } from '../../../helpers';

@Service()
export class WebhooksDataDiffer extends DataDiffer<DirectusWebhook<object>> {
  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    dataLoader: WebhooksDataLoader,
    dataClient: WebhooksDataClient,
    idMapper: WebhooksIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, WEBHOOKS_COLLECTION),
      dataLoader,
      dataClient,
      idMapper,
    );
  }
}
