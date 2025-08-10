import { DataDiffer } from '../base';
import { Service } from 'typedi';
import { POLICIES_COLLECTION } from './constants';
import { PoliciesDataLoader } from './data-loader';
import { PoliciesDataClient } from './data-client';
import { PoliciesIdMapperClient } from './id-mapper-client';
import { LoggerService } from '../../logger';
import { PoliciesDataMapper } from './data-mapper';
import { DirectusPolicy } from './interfaces';

@Service()
export class PoliciesDataDiffer extends DataDiffer<DirectusPolicy> {
  constructor(
    loggerService: LoggerService,
    dataLoader: PoliciesDataLoader,
    dataClient: PoliciesDataClient,
    dataMapper: PoliciesDataMapper,
    idMapper: PoliciesIdMapperClient,
  ) {
    super(
      loggerService.getChild(POLICIES_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
