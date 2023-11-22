import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { FLOWS_COLLECTION } from './constants';
import { ConfigService } from '../../config';

@Service()
export class FlowsIdMapperClient extends IdMapperClient {
  constructor(config: ConfigService) {
    super(config, FLOWS_COLLECTION);
  }
}
