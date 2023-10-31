import 'dotenv/config';
import {createWebhook, deleteWebhook, DirectusWebhook, Query, readWebhooks, updateWebhook,} from '@directus/sdk';
import {DirectusCollection} from './directus-collection';

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

    protected getDataMapper(): (
        data: DirectusWebhook<object>,
    ) => DirectusWebhook<object> {
        return function (p1: DirectusWebhook<object>) {
            return p1;
        };
    }

    protected getDeleteCommand(item: DirectusWebhook<object>) {
        return deleteWebhook(item.id);
    }

    protected getInsertCommand(item: DirectusWebhook<object>) {
        return createWebhook(item);
    }

    protected getMatchingItemCommand(item: DirectusWebhook<object>) {
        return readWebhooks({
            filter: {
                _and: [{method: {_eq: item.method}}, {url: {_eq: item.url}}],
            },
        });
    }

    protected getQueryCommand(query: Query<DirectusWebhook<object>, object>) {
        return readWebhooks(query);
    }

    protected getUpdateCommand(
        _sourceItem: DirectusWebhook<object>,
        targetItem: DirectusWebhook<object>,
        diffItem: Partial<DirectusWebhook<object>>,
    ) {
        return updateWebhook(targetItem.id, diffItem);
    }
}
