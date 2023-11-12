import {IdMapperClient} from '../base';
import {Inject, Service} from 'typedi';
import {FLOWS_COLLECTION} from './constants';
import {DIRECTUS_CONFIG} from "../../../constants";
import type {DirectusConfig} from "../../../config";

@Service()
export class FlowsIdMapperClient extends IdMapperClient {
    constructor(@Inject(DIRECTUS_CONFIG) config: DirectusConfig) {
        super(config, FLOWS_COLLECTION);
    }
}
