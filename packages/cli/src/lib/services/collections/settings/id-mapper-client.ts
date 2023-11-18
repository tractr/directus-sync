import {IdMapperClient} from '../base';
import {Inject, Service} from 'typedi';
import {SETTINGS_COLLECTION} from './constants';
import {DIRECTUS_CONFIG} from '../../../constants';
import type {DirectusConfig} from '../../../config';

@Service()
export class SettingsIdMapperClient extends IdMapperClient {
  constructor(@Inject(DIRECTUS_CONFIG) config: DirectusConfig) {
    super(config, SETTINGS_COLLECTION);
  }
}
