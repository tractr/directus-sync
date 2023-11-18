import { DataLoader } from '../base';

import { Inject, Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';
import path from 'path';
import type { CollectionsConfig } from '../../../config';
import { COLLECTIONS_CONFIG } from '../../../constants';
import { DirectusSettings } from './interfaces';

@Service()
export class SettingsDataLoader extends DataLoader<DirectusSettings> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(config.dumpPath, `${SETTINGS_COLLECTION}.json`);
    super(filePath);
  }
}
