import 'dotenv/config';
import { DirectusRole } from '@directus/sdk';
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

@Service()
export class RolesCollection extends DirectusCollection<DirectusRole<object>> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject('logger') baseLogger: pino.Logger,
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
