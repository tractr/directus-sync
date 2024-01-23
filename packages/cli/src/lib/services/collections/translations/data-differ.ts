import { DataDiffer } from '../base';

import { Inject, Service } from 'typedi';
import { TRANSLATIONS_COLLECTION } from './constants';
import pino from 'pino';
import { TranslationsDataLoader } from './data-loader';
import { TranslationsDataClient } from './data-client';
import { TranslationsIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { TranslationsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusTranslation } from './interfaces';

@Service()
export class TranslationsDataDiffer extends DataDiffer<DirectusTranslation> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataLoader: TranslationsDataLoader,
    dataClient: TranslationsDataClient,
    dataMapper: TranslationsDataMapper,
    idMapper: TranslationsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, TRANSLATIONS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
