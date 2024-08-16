import { DataLoader } from '../base';
import { Service } from 'typedi';
import { POLICIES_COLLECTION } from './constants';
import path from 'path';
import { DirectusPolicy } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class PoliciesDataLoader extends DataLoader<DirectusPolicy> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${POLICIES_COLLECTION}.json`,
    );
    const hooks = config.getCollectionHooksConfig(POLICIES_COLLECTION);
    super(filePath, migrationClient, hooks);
  }
}
