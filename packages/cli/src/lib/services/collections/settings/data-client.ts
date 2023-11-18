import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import { readSettings, updateSettings } from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusSettings } from './interfaces';

@Service()
export class SettingsDataClient extends DataClient<DirectusSettings> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand() {
    // Settings are not deletable
    throw new Error('This should never be called');
    return readSettings();
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusSettings>) {
    // Settings are not creatable, use update instead
    return updateSettings(item);
  }

  protected getQueryCommand(query: Query<DirectusSettings>) {
    // Remove the filter of the query, settings are not filterable
    const { filter, ...rest } = query;
    return readSettings(rest);
  }

  protected getUpdateCommand(
    itemId: 1,
    diffItem: Partial<WithoutIdAndSyncId<DirectusSettings>>,
  ) {
    return updateSettings({
      id: itemId,
      ...diffItem,
    });
  }
}
