import { DataLoader } from '../base';
import { DirectusPermission } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { PERMISSIONS_COLLECTION } from './constants';
import path from 'path';
import type { CollectionsConfig } from '../../../config';
import { COLLECTIONS_CONFIG } from '../../../constants';

@Service()
export class PermissionsDataLoader extends DataLoader<
  DirectusPermission<object>
> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(
      config.dumpPath,
      `${PERMISSIONS_COLLECTION}.json`,
    );
    super(filePath);
  }
}
