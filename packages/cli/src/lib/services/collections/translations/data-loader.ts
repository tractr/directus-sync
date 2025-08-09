import { DataLoader } from '../base';

import { Service } from 'typedi';
import { TRANSLATIONS_COLLECTION } from './constants';
import path from 'path';
import { DirectusTranslation } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class TranslationsDataLoader extends DataLoader<DirectusTranslation> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${TRANSLATIONS_COLLECTION}.json`,
    );
    const hooks = config.getCollectionHooksConfig(TRANSLATIONS_COLLECTION);
    super(filePath, migrationClient, hooks, config);
  }
}
