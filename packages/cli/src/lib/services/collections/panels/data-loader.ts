import {DataLoader} from '../base';
import {Inject, Service} from 'typedi';
import {PANELS_COLLECTION} from './constants';
import path from 'path';
import type {CollectionsConfig} from '../../../config';
import {COLLECTIONS_CONFIG} from '../../../constants';
import {DirectusPanel} from "./interfaces";

@Service()
export class PanelsDataLoader extends DataLoader<DirectusPanel> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(config.dumpPath, `${PANELS_COLLECTION}.json`);
    super(filePath);
  }
}
