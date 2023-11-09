import { DataClient, WithoutIdAndSyncId } from '../base';
import {
  createWebhook,
  deleteWebhook,
  DirectusWebhook,
  Query,
  readWebhooks,
  updateWebhook,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';

@Service()
export class WebhooksDataClient extends DataClient<DirectusWebhook<object>> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand(itemId: number) {
    return deleteWebhook(itemId);
  }

  protected getInsertCommand(
    item: WithoutIdAndSyncId<DirectusWebhook<object>>,
  ) {
    return createWebhook(item);
  }

  protected getQueryCommand(query: Query<DirectusWebhook<object>, object>) {
    return readWebhooks(query);
  }

  protected getUpdateCommand(
    itemId: number,
    diffItem: Partial<WithoutIdAndSyncId<DirectusWebhook<object>>>,
  ) {
    return updateWebhook(itemId, diffItem);
  }
}
