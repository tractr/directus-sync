import { DataLoader } from '../base';

import { Service } from 'typedi';
import { FOLDERS_COLLECTION } from './constants';
import path from 'path';
import { DirectusFolder } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class FoldersDataLoader extends DataLoader<DirectusFolder> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${FOLDERS_COLLECTION}.json`,
    );
    const hooks = config.getCollectionHooksConfig(FOLDERS_COLLECTION);
    super(filePath, migrationClient, hooks);
  }
}
