import { DataLoader } from '../base';
import { Service } from 'typedi';
import { ROLES_COLLECTION } from './constants';
import path from 'path';
import { DirectusRole } from './interfaces';
import { ConfigService } from '../../config';

@Service()
export class RolesDataLoader extends DataLoader<DirectusRole> {
  constructor(config: ConfigService) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${ROLES_COLLECTION}.json`,
    );
    super(filePath);
  }
}
