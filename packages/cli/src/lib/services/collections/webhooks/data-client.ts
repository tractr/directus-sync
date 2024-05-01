import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createWebhook,
  deleteWebhook,
  readWebhooks,
  updateWebhook,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusWebhook } from './interfaces';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { WEBHOOKS_COLLECTION } from './constants';

@Service()
export class WebhooksDataClient extends DataClient<DirectusWebhook> {
  constructor(@Inject(LOGGER) baseLogger: pino.Logger, migrationClient: MigrationClient) {
    super(getChildLogger(baseLogger, WEBHOOKS_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: number) {
    return deleteWebhook(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusWebhook>) {
    return createWebhook(item);
  }

  protected getQueryCommand(query: Query<DirectusWebhook>) {
    return readWebhooks(query);
  }

  protected getUpdateCommand(
    itemId: number,
    diffItem: Partial<WithoutIdAndSyncId<DirectusWebhook>>,
  ) {
    return updateWebhook(itemId, diffItem);
  }
}
