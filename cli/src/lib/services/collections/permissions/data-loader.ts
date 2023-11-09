import { DataLoader } from '../base';
import { DirectusPermission } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { PERMISSIONS_COLLECTION } from './constants';
import path from 'path';

@Service()
export class PermissionsDataLoader extends DataLoader<
  DirectusPermission<object>
> {
  constructor(@Inject('directusDumpPath') dumpPath: string) {
    const filePath = path.join(dumpPath, `${PERMISSIONS_COLLECTION}.json`);
    super(filePath);
  }
}
