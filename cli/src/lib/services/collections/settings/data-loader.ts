import { DataLoader } from '../base';
import { DirectusSettings } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';
import path from 'path';

@Service()
export class SettingsDataLoader extends DataLoader<DirectusSettings<object>> {
  constructor(@Inject('directusDumpPath') dumpPath: string) {
    const filePath = path.join(dumpPath, `${SETTINGS_COLLECTION}.json`);
    super(filePath);
  }
}
