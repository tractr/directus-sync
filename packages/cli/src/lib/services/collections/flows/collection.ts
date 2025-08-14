import { DirectusCollection, WithSyncIdAndWithoutId } from '../base';
import { Service } from 'typedi';
import { FlowsDataLoader } from './data-loader';
import { FlowsDataClient } from './data-client';
import { FlowsIdMapperClient } from './id-mapper-client';
import { FlowsDataDiffer } from './data-differ';
import { LoggerService } from '../../logger';
import { FLOWS_COLLECTION } from './constants';
import { FlowsDataMapper } from './data-mapper';
import { DirectusFlow } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class FlowsCollection extends DirectusCollection<DirectusFlow> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  protected readonly preserveIds = true;

  constructor(
    loggerService: LoggerService,
    dataDiffer: FlowsDataDiffer,
    dataLoader: FlowsDataLoader,
    dataClient: FlowsDataClient,
    dataMapper: FlowsDataMapper,
    idMapper: FlowsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      loggerService.getChild(FLOWS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(FLOWS_COLLECTION),
      },
    );
  }

  /**
   * Override the methods in order to break dependency cycle between flows and operations
   * Always create new flows without reference to operations. Then update the flow once the operations are created.
   */
  protected async create(
    toCreate: WithSyncIdAndWithoutId<DirectusFlow>[],
  ): Promise<boolean> {
    const shouldRetry = toCreate.length > 0;
    const toCreateWithoutOperations = toCreate.map((flow) => {
      return {
        ...flow,
        operation: null,
      };
    });
    await super.create(toCreateWithoutOperations);
    return shouldRetry;
  }
}
