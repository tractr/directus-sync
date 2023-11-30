import { DataLoader } from '../base';
import { Service } from 'typedi';
import { FLOWS_COLLECTION } from './constants';
import path from 'path';
import { DirectusFlow } from './interfaces';
import { ConfigService } from '../../config';

@Service()
export class FlowsDataLoader extends DataLoader<DirectusFlow> {
  constructor(config: ConfigService) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${FLOWS_COLLECTION}.json`,
    );
    super(filePath);
  }
}
