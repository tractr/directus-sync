import { DataLoader } from '../base';
import { Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';
import path from 'path';
import { DirectusPanel } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class PanelsDataLoader extends DataLoader<DirectusPanel> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${PANELS_COLLECTION}.json`,
    );
    const hooks = config.getCollectionHooksConfig(PANELS_COLLECTION);
    super(filePath, migrationClient, hooks);
  }
}
