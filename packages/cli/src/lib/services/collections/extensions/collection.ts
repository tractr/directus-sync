import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { ExtensionsDataLoader } from './data-loader';
import { ExtensionsDataClient } from './data-client';
import { ExtensionsIdMapperClient } from './id-mapper-client';
import { ExtensionsDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { EXTENSIONS_COLLECTION } from './constants';
import { ExtensionsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusExtension } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class ExtensionsCollection extends DirectusCollection<DirectusExtension> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  protected readonly preserveIds = true;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataDiffer: ExtensionsDataDiffer,
    dataLoader: ExtensionsDataLoader,
    dataClient: ExtensionsDataClient,
    dataMapper: ExtensionsDataMapper,
    idMapper: ExtensionsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      getChildLogger(baseLogger, EXTENSIONS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(EXTENSIONS_COLLECTION),
      },
    );
  }
}
