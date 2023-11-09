import 'dotenv/config';
import {
  DirectusSettings,
  Query,
  readSettings,
  updateSettings,
} from '@directus/sdk';
import { DirectusCollection } from '../base/directus-collection';
import { IdMapperClient } from '../base/id-mapper-client';
import { WithoutId, WithSyncId } from '../base';

/**
 * This class is responsible for merging the data from a dump to a target table.
 * It creates new data, updates existing data and deletes data that is not present in the dump.
 */
export class SettingsCollection extends DirectusCollection<
  DirectusSettings<object>
> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = false;

  protected readonly name = 'settings';

  protected createIdMapperClient() {
    return new IdMapperClient('settings');
  }

  protected getDataMapper(): (
    data: WithSyncId<DirectusSettings<object>>,
  ) => WithSyncId<DirectusSettings<object>> {
    return function (p1: WithSyncId<DirectusSettings<object>>) {
      return p1;
    };
  }

  protected getDeleteCommand(_id: number) {
    // Settings are not deletable
    throw new Error('This should never be called');
    return readSettings();
  }

  protected getInsertCommand(item: DirectusSettings<object>) {
    // Settings are not creatable, use update instead
    return updateSettings(item);
  }

  protected getQueryCommand(query: Query<DirectusSettings<object>, object>) {
    return readSettings(query);
  }

  protected getUpdateCommand(
    _sourceItem: DirectusSettings<object>,
    targetItem: DirectusSettings<object>,
    diffItem: Partial<WithoutId<DirectusSettings<object>>>,
  ) {
    return updateSettings({
      id: targetItem.id,
      ...diffItem,
    });
  }
}
