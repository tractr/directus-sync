import { DataClient, WithoutIdAndSyncId } from '../base';
import {
  DirectusSettings,
  Query,
  readSettings,
  updateSettings,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';

@Service()
export class SettingsDataClient extends DataClient<DirectusSettings<object>> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand() {
    // Settings are not deletable
    throw new Error('This should never be called');
    return readSettings();
  }

  protected getInsertCommand(
    item: WithoutIdAndSyncId<DirectusSettings<object>>,
  ) {
    // Settings are not creatable, use update instead
    return updateSettings(item);
  }

  protected getQueryCommand(query: Query<DirectusSettings<object>, object>) {
    // Remove the filter of the query, settings are not filterable
    const { filter, ...rest } = query;
    return readSettings(rest);
  }

  protected getUpdateCommand(
    itemId: 1,
    diffItem: Partial<WithoutIdAndSyncId<DirectusSettings<object>>>,
  ) {
    return updateSettings({
      id: itemId,
      ...diffItem,
    });
  }
}
