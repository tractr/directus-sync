import { DataLoader, WithSyncIdAndWithoutId } from '../base';
import { Service } from 'typedi';
import { PERMISSIONS_COLLECTION } from './constants';
import path from 'path';
import { DirectusPermission } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class PermissionsDataLoader extends DataLoader<DirectusPermission> {
  constructor(config: ConfigService, migrationClient: MigrationClient) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${PERMISSIONS_COLLECTION}.json`,
    );
    const hooks = config.getCollectionHooksConfig(PERMISSIONS_COLLECTION);
    super(filePath, migrationClient, hooks);
  }

  protected getSortFunction(): (
    a: WithSyncIdAndWithoutId<DirectusPermission>,
    b: WithSyncIdAndWithoutId<DirectusPermission>,
  ) => number {
    return (a, b) => {
      const aVal = `${a.policy as string}-${a.collection}-${a.action}`;
      const bVal = `${b.policy as string}-${b.collection}-${b.action}`;
      return aVal.localeCompare(bVal);
    };
  }
}
