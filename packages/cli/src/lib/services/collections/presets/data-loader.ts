import { DataLoader } from '../base';
import { Service } from 'typedi';
import { PRESETS_COLLECTION } from './constants';
import path from 'path';
import { DirectusPreset } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class PresetsDataLoader extends DataLoader<DirectusPreset> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${PRESETS_COLLECTION}.json`,
    );
    const hooks = config.getCollectionHooksConfig(PRESETS_COLLECTION);
    super(filePath, migrationClient, hooks);
  }
}
