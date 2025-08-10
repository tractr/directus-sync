import { DirectusCollection } from '../base';
import { Service } from 'typedi';
import { PermissionsDataLoader } from './data-loader';
import { PermissionsDataClient } from './data-client';
import { PermissionsIdMapperClient } from './id-mapper-client';
import { PermissionsDataDiffer } from './data-differ';
import { LoggerService } from '../../logger';
import { PERMISSIONS_COLLECTION } from './constants';
import { PermissionsDataMapper } from './data-mapper';
import { DirectusPermission } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class PermissionsCollection extends DirectusCollection<DirectusPermission> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    loggerService: LoggerService,
    dataDiffer: PermissionsDataDiffer,
    dataLoader: PermissionsDataLoader,
    dataClient: PermissionsDataClient,
    dataMapper: PermissionsDataMapper,
    idMapper: PermissionsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      loggerService.getChild(PERMISSIONS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(PERMISSIONS_COLLECTION),
      },
    );
  }
}
