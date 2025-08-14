import { DataDiffer } from '../base';
import { Service } from 'typedi';
import { ROLES_COLLECTION } from './constants';
import { RolesDataLoader } from './data-loader';
import { RolesDataClient } from './data-client';
import { RolesIdMapperClient } from './id-mapper-client';
import { LoggerService } from '../../logger';
import { RolesDataMapper } from './data-mapper';
import { DirectusRole } from './interfaces';

@Service()
export class RolesDataDiffer extends DataDiffer<DirectusRole> {
  constructor(
    loggerService: LoggerService,
    dataLoader: RolesDataLoader,
    dataClient: RolesDataClient,
    dataMapper: RolesDataMapper,
    idMapper: RolesIdMapperClient,
  ) {
    super(
      loggerService.getChild(ROLES_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
