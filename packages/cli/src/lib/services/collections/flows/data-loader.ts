import { DataLoader } from '../base';
import { Service } from 'typedi';
import { FLOWS_COLLECTION } from './constants';
import path from 'path';
import { DirectusFlow } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class FlowsDataLoader extends DataLoader<DirectusFlow> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${FLOWS_COLLECTION}.json`,
    );
    const hooks = config.getHooksConfig(FLOWS_COLLECTION);
    super(filePath, migrationClient, hooks);
  }
}
