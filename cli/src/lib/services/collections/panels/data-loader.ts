import { DataLoader } from '../base';
import { DirectusPanel } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';
import path from 'path';

@Service()
export class PanelsDataLoader extends DataLoader<DirectusPanel<object>> {
  constructor(@Inject('directusDumpPath') dumpPath: string) {
    const filePath = path.join(dumpPath, `${PANELS_COLLECTION}.json`);
    super(filePath);
  }
}
