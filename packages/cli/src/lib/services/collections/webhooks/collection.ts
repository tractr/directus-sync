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
import { DirectusWebhook } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class WebhooksCollection extends DirectusCollection<DirectusWebhook> {
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
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      getChildLogger(baseLogger, WEBHOOKS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      config.getCollectionHooksConfig(WEBHOOKS_COLLECTION),
    );
  }
}
