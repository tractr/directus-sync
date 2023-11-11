import { DataLoader } from '../base';
import { DirectusSettings } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';
import path from 'path';
import type {CollectionsConfig} from "../../../config";
import {COLLECTIONS_CONFIG} from "../../../config";

@Service()
export class SettingsDataLoader extends DataLoader<DirectusSettings<object>> {
  constructor(@Inject(COLLECTIONS_CONFIG) config: CollectionsConfig) {
    const filePath = path.join(config.dumpPath, `${SETTINGS_COLLECTION}.json`);
    super(filePath);
  }
}
