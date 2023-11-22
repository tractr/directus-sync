import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';
import { ConfigService } from '../../config';

@Service()
export class PanelsIdMapperClient extends IdMapperClient {
  constructor(config: ConfigService) {
    super(config, PANELS_COLLECTION);
  }
}
