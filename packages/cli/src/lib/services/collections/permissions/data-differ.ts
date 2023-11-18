import {DataDiffer} from '../base';
import {Inject, Service} from 'typedi';
import {PERMISSIONS_COLLECTION} from './constants';
import pino from 'pino';
import {PermissionsDataLoader} from './data-loader';
import {PermissionsDataClient} from './data-client';
import {PermissionsIdMapperClient} from './id-mapper-client';
import {getChildLogger} from '../../../helpers';
import {PermissionsDataMapper} from './data-mapper';
import {LOGGER} from '../../../constants';
import {DirectusPermission} from "./interfaces";

@Service()
export class PermissionsDataDiffer extends DataDiffer<
  DirectusPermission
> {
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
}
