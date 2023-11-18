import {DataLoader, WithSyncIdAndWithoutId} from '../base';
import {Inject, Service} from 'typedi';
import {OPERATIONS_COLLECTION} from './constants';
import path from 'path';
import type {CollectionsConfig} from '../../../config';
import {COLLECTIONS_CONFIG} from '../../../constants';
import {DirectusOperation} from "./interfaces";

@Service()
export class OperationsDataLoader extends DataLoader<
  DirectusOperation
> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(
      config.dumpPath,
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
