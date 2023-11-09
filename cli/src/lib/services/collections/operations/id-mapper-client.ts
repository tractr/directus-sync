import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { OPERATIONS_COLLECTION } from './constants';

@Service()
export class OperationsIdMapperClient extends IdMapperClient {
  constructor() {
    super(OPERATIONS_COLLECTION);
  }
}
