import { DataLoader } from '../base';
import { DirectusOperation } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { OPERATIONS_COLLECTION } from './constants';
import path from 'path';

@Service()
export class OperationsDataLoader extends DataLoader<DirectusOperation<object>> {
  constructor(@Inject('directusDumpPath') dumpPath: string) {
    const filePath = path.join(dumpPath, `${OPERATIONS_COLLECTION}.json`);
    super(filePath);
  }
}
