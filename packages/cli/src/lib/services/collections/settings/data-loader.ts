import { DataLoader } from '../base';

import { Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';
import path from 'path';
import { DirectusSettings } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class SettingsDataLoader extends DataLoader<DirectusSettings> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${SETTINGS_COLLECTION}.json`,
    );
    const hooks = config.getHooksConfig(SETTINGS_COLLECTION);
    super(filePath, migrationClient, hooks);
  }
}
