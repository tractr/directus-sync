import { DirectusCollection } from '../base';
import { Service } from 'typedi';
import { PoliciesDataLoader } from './data-loader';
import { PoliciesDataClient } from './data-client';
import { PoliciesIdMapperClient } from './id-mapper-client';
import { PoliciesDataDiffer } from './data-differ';
import { LoggerService } from '../../logger';
import { POLICIES_COLLECTION } from './constants';
import { PoliciesDataMapper } from './data-mapper';
import { DirectusPolicy } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class PoliciesCollection extends DirectusCollection<DirectusPolicy> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    loggerService: LoggerService,
    dataDiffer: PoliciesDataDiffer,
    dataLoader: PoliciesDataLoader,
    dataClient: PoliciesDataClient,
    dataMapper: PoliciesDataMapper,
    idMapper: PoliciesIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      loggerService.getChild(POLICIES_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(POLICIES_COLLECTION),
        preserveIds: config.shouldPreserveIds(POLICIES_COLLECTION),
      },
    );
  }
}
