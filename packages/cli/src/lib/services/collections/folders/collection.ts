import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { FoldersDataLoader } from './data-loader';
import { FoldersDataClient } from './data-client';
import { FoldersIdMapperClient } from './id-mapper-client';
import { FoldersDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { FOLDERS_COLLECTION } from './constants';
import { FoldersDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusFolder } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class FoldersCollection extends DirectusCollection<DirectusFolder> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  protected readonly preserveIds = true;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataDiffer: FoldersDataDiffer,
    dataLoader: FoldersDataLoader,
    dataClient: FoldersDataClient,
    dataMapper: FoldersDataMapper,
    idMapper: FoldersIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      getChildLogger(baseLogger, FOLDERS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      config.getHooksConfig(FOLDERS_COLLECTION),
    );
  }
}
