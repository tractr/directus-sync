import 'dotenv/config';
import { DirectusPermission } from '@directus/sdk';
import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { PermissionsDataLoader } from './data-loader';
import { PermissionsDataClient } from './data-client';
import { PermissionsIdMapperClient } from './id-mapper-client';
import { PermissionsDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { PERMISSIONS_COLLECTION } from './constants';
import { PermissionsDataMapper } from './data-mapper';

@Service()
export class PermissionsCollection extends DirectusCollection<
  DirectusPermission<object>
> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    dataDiffer: PermissionsDataDiffer,
    dataLoader: PermissionsDataLoader,
    dataClient: PermissionsDataClient,
    dataMapper: PermissionsDataMapper,
    idMapper: PermissionsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, PERMISSIONS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
