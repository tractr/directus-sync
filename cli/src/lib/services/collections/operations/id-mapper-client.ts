import {IdMapperClient} from '../base';
import {Inject, Service} from 'typedi';
import {OPERATIONS_COLLECTION} from './constants';
import {DIRECTUS_CONFIG} from "../../../constants";
import type {DirectusConfig} from "../../../config";

@Service()
export class OperationsIdMapperClient extends IdMapperClient {
    constructor(@Inject(DIRECTUS_CONFIG) config: DirectusConfig) {
        super(config, OPERATIONS_COLLECTION);
    }
}
