import { DataLoader, WithSyncIdAndWithoutId } from '../base';
import { Service } from 'typedi';
import { OPERATIONS_COLLECTION } from './constants';
import path from 'path';
import { DirectusOperation } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class OperationsDataLoader extends DataLoader<DirectusOperation> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${OPERATIONS_COLLECTION}.json`,
    );
    const hooks = config.getCollectionHooksConfig(OPERATIONS_COLLECTION);
    super(filePath, migrationClient, hooks);
  }

  protected getSortFunction(): (
    a: WithSyncIdAndWithoutId<DirectusOperation>,
    b: WithSyncIdAndWithoutId<DirectusOperation>,
  ) => number {
    return (a, b) => a.key.localeCompare(b.key);
  }
}
