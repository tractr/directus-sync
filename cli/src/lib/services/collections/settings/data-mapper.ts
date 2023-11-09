import { DataMapper } from '../base';
import { DirectusSettings } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { FLOWS_COLLECTION } from '../flows';

@Service()
export class SettingsDataMapper extends DataMapper<DirectusSettings<object>> {
  constructor(@Inject('logger') baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION));
  }
}
