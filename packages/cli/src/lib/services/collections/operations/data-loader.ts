import { DataLoader, WithSyncIdAndWithoutId } from '../base';
import { Service } from 'typedi';
import { OPERATIONS_COLLECTION } from './constants';
import path from 'path';
import { DirectusOperation } from './interfaces';
import { ConfigService } from '../../config';

@Service()
export class OperationsDataLoader extends DataLoader<DirectusOperation> {
  constructor(config: ConfigService) {
    const filePath = path.join(
      config.getCollectionsConfig().dumpPath,
      `${OPERATIONS_COLLECTION}.json`,
    );
    super(filePath);
  }

  protected getSortFunction(): (
    a: WithSyncIdAndWithoutId<DirectusOperation>,
    b: WithSyncIdAndWithoutId<DirectusOperation>,
  ) => number {
    return (a, b) => a.key.localeCompare(b.key);
  }
}
