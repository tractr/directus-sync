import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';

@Service()
export class PanelsIdMapperClient extends IdMapperClient {
  constructor() {
    super(PANELS_COLLECTION);
  }
}
