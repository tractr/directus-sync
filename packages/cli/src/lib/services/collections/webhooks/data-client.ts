import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createWebhook,
  deleteWebhook,
  readWebhooks,
  updateWebhook,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusWebhook } from './interfaces';

@Service()
export class WebhooksDataClient extends DataClient<DirectusWebhook> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
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
