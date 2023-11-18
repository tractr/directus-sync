import { IdMapperClient } from '../base';
import { Inject, Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';
import { DIRECTUS_CONFIG } from '../../../constants';
import type { DirectusConfig } from '../../../config';

@Service()
export class PanelsIdMapperClient extends IdMapperClient {
  constructor(@Inject(DIRECTUS_CONFIG) config: DirectusConfig) {
    super(config, PANELS_COLLECTION);
  }
}
