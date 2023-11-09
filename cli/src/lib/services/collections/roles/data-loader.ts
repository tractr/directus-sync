import { DataLoader } from '../base';
import { DirectusRole } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { ROLES_COLLECTION } from './constants';
import path from 'path';

@Service()
export class RolesDataLoader extends DataLoader<
  DirectusRole<object>
> {
  constructor(@Inject('directusDumpPath') dumpPath: string) {
    const filePath = path.join(dumpPath, `${ROLES_COLLECTION}.json`);
    super(filePath);
  }
}
