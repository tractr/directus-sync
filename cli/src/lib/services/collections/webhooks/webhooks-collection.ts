import 'dotenv/config';
import { DirectusWebhook } from '@directus/sdk';
import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { WebhooksDataLoader } from './webhooks-data-loader';
import { WebhooksDataClient } from './webhooks-data-client';
import { WebhooksIdMapperClient } from './webhooks-id-mapper-client';
import { WebhooksDataDiffer } from './webhooks-data-differ';
import { getChildLogger } from '../../../helpers';
import { WEBHOOKS_COLLECTION } from './constants';

@Service()
export class WebhooksCollection extends DirectusCollection<
  DirectusWebhook<object>
> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    dataDiffer: WebhooksDataDiffer,
    dataLoader: WebhooksDataLoader,
    dataClient: WebhooksDataClient,
    idMapper: WebhooksIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, WEBHOOKS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      idMapper,
    );
  }
}
