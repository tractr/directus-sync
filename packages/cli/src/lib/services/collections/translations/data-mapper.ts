import { DataMapper } from '../base';

import { Service } from 'typedi';
import { LoggerService } from '../../logger';
import { TRANSLATIONS_COLLECTION } from './constants';
import { DirectusTranslation } from './interfaces';

@Service()
export class TranslationsDataMapper extends DataMapper<DirectusTranslation> {
  constructor(loggerService: LoggerService) {
    super(loggerService.getChild(TRANSLATIONS_COLLECTION));
  }
}
