import 'dotenv/config';
import { DirectusWebhook } from '@directus/sdk';
import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { WebhooksDataLoader } from './data-loader';
import { WebhooksDataClient } from './data-client';
import { WebhooksIdMapperClient } from './id-mapper-client';
import { WebhooksDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { WEBHOOKS_COLLECTION } from './constants';
import { WebhooksDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';

@Service()
export class WebhooksCollection extends DirectusCollection<
  DirectusWebhook<object>
> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataDiffer: WebhooksDataDiffer,
    dataLoader: WebhooksDataLoader,
    dataClient: WebhooksDataClient,
    dataMapper: WebhooksDataMapper,
    idMapper: WebhooksIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, WEBHOOKS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
