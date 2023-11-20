import { DataLoader, WithSyncIdAndWithoutId } from '../base';
import { Inject, Service } from 'typedi';
import { PERMISSIONS_COLLECTION } from './constants';
import path from 'path';
import type { CollectionsConfig } from '../../../config';
import { COLLECTIONS_CONFIG } from '../../../constants';
import { DirectusPermission } from './interfaces';

@Service()
export class PermissionsDataLoader extends DataLoader<DirectusPermission> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(
      config.dumpPath,
      `${PERMISSIONS_COLLECTION}.json`,
    );
    super(filePath);
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
