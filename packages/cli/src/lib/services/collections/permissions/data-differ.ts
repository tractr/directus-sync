import {
  DataDiffer,
  DirectusId,
  Query,
  chunks,
  runSequentially,
} from '../base';
import { Inject, Service } from 'typedi';
import { PERMISSIONS_COLLECTION } from './constants';
import pino from 'pino';
import { PermissionsDataLoader } from './data-loader';
import { PermissionsDataClient } from './data-client';
import { PermissionsIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { PermissionsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusPermission } from './interfaces';

@Service()
export class PermissionsDataDiffer extends DataDiffer<DirectusPermission> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataLoader: PermissionsDataLoader,
    dataClient: PermissionsDataClient,
    dataMapper: PermissionsDataMapper,
    idMapper: PermissionsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, PERMISSIONS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }

  /**
   * Add more fields in the request to get id field
   * https://github.com/directus/directus/issues/21965
   */
  protected async getExistingIds(
    localIds: string[],
  ): Promise<{ id: DirectusId }[]> {
    const idsChunks = [...chunks(localIds.map(Number), this.maxIdsPerRequest)];
    const tasks = idsChunks.map(
      (idsChunk) => () =>
        this.dataClient.query({
          filter: {
            id: {
              _in: idsChunk,
            },
          },
          limit: -1,
          fields: ['id', 'policy', 'collection', 'action'],
        } as Query<DirectusPermission>),
    );
    return await runSequentially(tasks).then((results) => results.flat());
  }
}
