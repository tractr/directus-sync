import { DataLoader } from '../base';

import { Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';
import path from 'path';
import { DirectusSettings } from './interfaces';
import { ConfigService } from '../../config';

@Service()
export class SettingsDataLoader extends DataLoader<DirectusSettings> {
  constructor(config: ConfigService) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${SETTINGS_COLLECTION}.json`,
    );
    super(filePath);
  }
}
