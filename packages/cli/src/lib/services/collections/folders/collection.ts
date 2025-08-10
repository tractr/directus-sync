import { DirectusCollection } from '../base';
import { Service } from 'typedi';
import { FoldersDataLoader } from './data-loader';
import { FoldersDataClient } from './data-client';
import { FoldersIdMapperClient } from './id-mapper-client';
import { FoldersDataDiffer } from './data-differ';
import { LoggerService } from '../../logger';
import { FOLDERS_COLLECTION } from './constants';
import { FoldersDataMapper } from './data-mapper';
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
    loggerService: LoggerService,
    dataDiffer: FoldersDataDiffer,
    dataLoader: FoldersDataLoader,
    dataClient: FoldersDataClient,
    dataMapper: FoldersDataMapper,
    idMapper: FoldersIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      loggerService.getChild(FOLDERS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(FOLDERS_COLLECTION),
      },
    );
  }
}
