import { DataLoader } from '../base';
import { Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';
import path from 'path';
import { DirectusPanel } from './interfaces';
import { ConfigService } from '../../config';

@Service()
export class PanelsDataLoader extends DataLoader<DirectusPanel> {
  constructor(config: ConfigService) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${PANELS_COLLECTION}.json`,
    );
    const transformDataHooks = config.getHooksConfig(PANELS_COLLECTION);
    super(filePath, transformDataHooks);
  }
}
