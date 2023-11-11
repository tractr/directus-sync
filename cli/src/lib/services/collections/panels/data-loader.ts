import { DataLoader } from '../base';
import { DirectusPanel } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';
import path from 'path';
import type {CollectionsConfig} from "../../../config";
import {COLLECTIONS_CONFIG} from "../../../constants";

@Service()
export class PanelsDataLoader extends DataLoader<DirectusPanel<object>> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(config.dumpPath, `${PANELS_COLLECTION}.json`);
    super(filePath);
  }
}
