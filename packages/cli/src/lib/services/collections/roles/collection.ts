import { DirectusCollection } from '../base';
import { Service } from 'typedi';
import { RolesDataLoader } from './data-loader';
import { RolesDataClient } from './data-client';
import { RolesIdMapperClient } from './id-mapper-client';
import { RolesDataDiffer } from './data-differ';
import { LoggerService } from '../../logger';
import { ROLES_COLLECTION } from './constants';
import { RolesDataMapper } from './data-mapper';
import { DirectusRole } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class RolesCollection extends DirectusCollection<DirectusRole> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    loggerService: LoggerService,
    dataDiffer: RolesDataDiffer,
    dataLoader: RolesDataLoader,
    dataClient: RolesDataClient,
    dataMapper: RolesDataMapper,
    idMapper: RolesIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      loggerService.getChild(ROLES_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(ROLES_COLLECTION),
        preserveIds: config.shouldPreserveIds(ROLES_COLLECTION),
      },
    );
  }
}
