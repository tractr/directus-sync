import { DataLoader } from '../base';
import { DirectusFlow } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { FLOWS_COLLECTION } from './constants';
import path from 'path';

@Service()
export class FlowsDataLoader extends DataLoader<DirectusFlow<object>> {
  constructor(@Inject('directusDumpPath') dumpPath: string) {
    const filePath = path.join(dumpPath, `${FLOWS_COLLECTION}.json`);
    super(filePath);
  }
}
