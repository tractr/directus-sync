import { DataLoader } from '../base';
import { DirectusOperation } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { OPERATIONS_COLLECTION } from './constants';
import path from 'path';
import type {CollectionsConfig} from "../../../config";
import {COLLECTIONS_CONFIG} from "../../../config";

@Service()
export class OperationsDataLoader extends DataLoader<
  DirectusOperation<object>
> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(config.dumpPath, `${OPERATIONS_COLLECTION}.json`);
    super(filePath);
  }
}
