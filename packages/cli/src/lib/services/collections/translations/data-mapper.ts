import { DataMapper } from '../base';

import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { TRANSLATIONS_COLLECTION } from './constants';
import { DirectusTranslation } from './interfaces';

@Service()
export class TranslationsDataMapper extends DataMapper<DirectusTranslation> {
  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, TRANSLATIONS_COLLECTION));
  }
}
