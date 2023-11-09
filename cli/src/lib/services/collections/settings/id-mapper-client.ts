import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';

@Service()
export class SettingsIdMapperClient extends IdMapperClient {
  constructor() {
    super(SETTINGS_COLLECTION);
  }
}
