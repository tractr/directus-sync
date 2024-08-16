import { DataDiffer } from '../base';
import { Inject, Service } from 'typedi';
import { POLICIES_COLLECTION } from './constants';
import pino from 'pino';
import { PoliciesDataLoader } from './data-loader';
import { PoliciesDataClient } from './data-client';
import { PoliciesIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { PoliciesDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusPolicy } from './interfaces';

@Service()
export class PoliciesDataDiffer extends DataDiffer<DirectusPolicy> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataLoader: PoliciesDataLoader,
    dataClient: PoliciesDataClient,
    dataMapper: PoliciesDataMapper,
    idMapper: PoliciesIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, POLICIES_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
