import { DataDiffer } from '../base';
import { DirectusRole } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { ROLES_COLLECTION } from './constants';
import pino from 'pino';
import { RolesDataLoader } from './data-loader';
import { RolesDataClient } from './data-client';
import { RolesIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { RolesDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';

@Service()
export class RolesDataDiffer extends DataDiffer<DirectusRole<object>> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataLoader: RolesDataLoader,
    dataClient: RolesDataClient,
    dataMapper: RolesDataMapper,
    idMapper: RolesIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, ROLES_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
