import { IdMap, IdMapperClient } from '../base';
import { Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LoggerService } from '../../logger';
import { readSettings } from '@directus/sdk';

@Service()
export class SettingsIdMapperClient extends IdMapperClient {
  /**
   * This placeholder is used to represent the settings in the id map.
   */
  protected readonly settingsPlaceholder = '_sync_default_settings';

  constructor(migrationClient: MigrationClient, loggerService: LoggerService) {
    super(
      migrationClient,
      loggerService.getChild(SETTINGS_COLLECTION),
      SETTINGS_COLLECTION,
    );
  }

  /**
   * This method return the id of the settings.
   * It should be 1, but we
   */
  async getSettingsId() {
    const directus = await this.migrationClient.get();
    const { id } = await directus.request(
      readSettings({
        fields: ['id'],
      }),
    );
    return id ?? 1;
  }

  /**
   * Force settings placeholder for singleton.
   */
  async create(localId: string | number, _syncId?: string): Promise<string> {
    return await super.create(localId, this.settingsPlaceholder);
  }

  /**
   * Create the sync id of the admin role on the fly, as it already has been synced.
   */
  async getBySyncId(syncId: string): Promise<IdMap | undefined> {
    // Automatically create the default admin role id map if it doesn't exist
    if (syncId === this.settingsPlaceholder) {
      const idMap = await super.getBySyncId(syncId);
      if (idMap) {
        return idMap;
      }
      const adminRoleId = await this.getSettingsId();
      await super.create(adminRoleId, this.settingsPlaceholder);
      this.logger.debug(`Created settings id map with local id ${adminRoleId}`);
    }
    return await super.getBySyncId(syncId);
  }
}
