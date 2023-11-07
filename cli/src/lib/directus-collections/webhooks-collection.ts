import 'dotenv/config';
import {
  createWebhook,
  deleteWebhook,
  DirectusWebhook,
  Query,
  readWebhooks,
  updateWebhook,
} from '@directus/sdk';
import {
  DirectusCollection,
  WithoutId,
  WithSyncId,
} from './directus-collection';
import { IdMapperClient } from './id-mapper-client';

/**
 * This class is responsible for merging the data from a dump to a target table.
 * It creates new data, updates existing data and deletes data that is not present in the dump.
 */
export class WebhooksCollection extends DirectusCollection<
  DirectusWebhook<object>
> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  protected readonly name = 'webhooks';

  protected createIdMapperClient() {
    return new IdMapperClient('webhooks');
  }

  protected getDataMapper(): (
    data: WithSyncId<DirectusWebhook<object>>,
  ) => WithSyncId<DirectusWebhook<object>> {
    return function (p1: WithSyncId<DirectusWebhook<object>>) {
      return p1;
    };
  }

  protected getDeleteCommand(id: number) {
    return deleteWebhook(id);
  }

  protected getInsertCommand(item: DirectusWebhook<object>) {
    return createWebhook(item);
  }

  protected getQueryCommand(query: Query<DirectusWebhook<object>, object>) {
    return readWebhooks(query);
  }

  protected getUpdateCommand(
    _sourceItem: DirectusWebhook<object>,
    targetItem: DirectusWebhook<object>,
    diffItem: Partial<WithoutId<DirectusWebhook<object>>>,
  ) {
    return updateWebhook(targetItem.id, diffItem);
  }
}
