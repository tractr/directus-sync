import { DataLoader } from '../base';
import { Service } from 'typedi';
import { ROLES_COLLECTION } from './constants';
import path from 'path';
import { DirectusRole } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class RolesDataLoader extends DataLoader<DirectusRole> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${ROLES_COLLECTION}.json`,
    );
    const transformDataHooks = config.getHooksConfig(ROLES_COLLECTION);
    super(filePath, migrationClient, transformDataHooks);
  }
}
