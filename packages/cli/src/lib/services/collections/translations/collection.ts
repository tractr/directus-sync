import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { TranslationsDataLoader } from './data-loader';
import { TranslationsDataClient } from './data-client';
import { TranslationsIdMapperClient } from './id-mapper-client';
import { TranslationsDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { TRANSLATIONS_COLLECTION } from './constants';
import { TranslationsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusTranslation } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class TranslationsCollection extends DirectusCollection<DirectusTranslation> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataDiffer: TranslationsDataDiffer,
    dataLoader: TranslationsDataLoader,
    dataClient: TranslationsDataClient,
    dataMapper: TranslationsDataMapper,
    idMapper: TranslationsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      getChildLogger(baseLogger, TRANSLATIONS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(TRANSLATIONS_COLLECTION),
        preserveIds: config.shouldPreserveIds(TRANSLATIONS_COLLECTION),
      },
    );
  }
}
