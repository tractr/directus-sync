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
    const transformDataHooks = config.getHooksConfig(PERMISSIONS_COLLECTION);
    super(filePath, migrationClient, transformDataHooks);
  }

  protected getSortFunction(): (
    a: WithSyncIdAndWithoutId<DirectusPermission>,
    b: WithSyncIdAndWithoutId<DirectusPermission>,
  ) => number {
    return (a, b) => {
      const aVal = `${a.role as string}-${a.collection}-${a.action}`;
      const bVal = `${b.role as string}-${b.collection}-${b.action}`;
      return aVal.localeCompare(bVal);
    };
  }
}
