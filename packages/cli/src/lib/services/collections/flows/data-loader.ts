import { DataLoader } from '../base';
import { Inject, Service } from 'typedi';
import { FLOWS_COLLECTION } from './constants';
import path from 'path';
import type { CollectionsConfig } from '../../../config';
import { COLLECTIONS_CONFIG } from '../../../constants';
import { DirectusFlow } from './interfaces';

@Service()
export class FlowsDataLoader extends DataLoader<DirectusFlow> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(config.dumpPath, `${FLOWS_COLLECTION}.json`);
    super(filePath);
  }
}
