import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { FLOWS_COLLECTION } from './constants';

@Service()
export class FlowsIdMapperClient extends IdMapperClient {
  constructor() {
    super(FLOWS_COLLECTION);
  }
}
