import { DataDiffer } from '../base';

import { Service } from 'typedi';
import { TRANSLATIONS_COLLECTION } from './constants';
import { TranslationsDataLoader } from './data-loader';
import { TranslationsDataClient } from './data-client';
import { TranslationsIdMapperClient } from './id-mapper-client';
import { LoggerService } from '../../logger';
import { TranslationsDataMapper } from './data-mapper';
import { DirectusTranslation } from './interfaces';

@Service()
export class TranslationsDataDiffer extends DataDiffer<DirectusTranslation> {
  constructor(
    loggerService: LoggerService,
    dataLoader: TranslationsDataLoader,
    dataClient: TranslationsDataClient,
    dataMapper: TranslationsDataMapper,
    idMapper: TranslationsIdMapperClient,
  ) {
    super(
      loggerService.getChild(TRANSLATIONS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
