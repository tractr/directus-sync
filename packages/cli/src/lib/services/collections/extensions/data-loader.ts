import { DataLoader } from '../base';
import { Service } from 'typedi';
import { EXTENSIONS_COLLECTION } from './constants';
import path from 'path';
import { DirectusExtension } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class ExtensionsDataLoader extends DataLoader<DirectusExtension> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${EXTENSIONS_COLLECTION}.json`,
    );
    const hooks = config.getCollectionHooksConfig(EXTENSIONS_COLLECTION);
    super(filePath, migrationClient, hooks);
  }
}
