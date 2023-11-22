import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';
import { ConfigService } from '../../config';

@Service()
export class SettingsIdMapperClient extends IdMapperClient {
  constructor(config: ConfigService) {
    super(config, SETTINGS_COLLECTION);
  }
}
