import {IdMapperClient} from '../base';
import {Inject, Service} from 'typedi';
import {WEBHOOKS_COLLECTION} from './constants';
import {DIRECTUS_CONFIG} from "../../../constants";
import type {DirectusConfig} from "../../../config";

@Service()
export class WebhooksIdMapperClient extends IdMapperClient {
    constructor(@Inject(DIRECTUS_CONFIG) config: DirectusConfig) {
        super(config, WEBHOOKS_COLLECTION);
    }
}
