import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { OPERATIONS_COLLECTION } from './constants';
import { ConfigService } from '../../config';

@Service()
export class OperationsIdMapperClient extends IdMapperClient {
  constructor(config: ConfigService) {
    super(config, OPERATIONS_COLLECTION);
  }
}
