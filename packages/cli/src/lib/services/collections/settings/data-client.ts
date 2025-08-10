import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import { readSettings, updateSettings } from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusSettings } from './interfaces';
import { LoggerService } from '../../logger';
import { SETTINGS_COLLECTION } from './constants';

@Service()
export class SettingsDataClient extends DataClient<DirectusSettings> {
  constructor(loggerService: LoggerService, migrationClient: MigrationClient) {
    super(loggerService.getChild(SETTINGS_COLLECTION), migrationClient);
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
    return readSettings(rest as Query<DirectusSettings>);
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
