import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { RolesDataLoader } from './data-loader';
import { RolesDataClient } from './data-client';
import { RolesIdMapperClient } from './id-mapper-client';
import { RolesDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { ROLES_COLLECTION } from './constants';
import { RolesDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusRole } from './interfaces';

@Service()
export class RolesCollection extends DirectusCollection<DirectusRole> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataDiffer: RolesDataDiffer,
    dataLoader: RolesDataLoader,
    dataClient: RolesDataClient,
    dataMapper: RolesDataMapper,
    idMapper: RolesIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, ROLES_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
