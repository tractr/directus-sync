import { DataDiffer } from '../base';

import { Inject, Service } from 'typedi';
import { FOLDERS_COLLECTION } from './constants';
import pino from 'pino';
import { FoldersDataLoader } from './data-loader';
import { FoldersDataClient } from './data-client';
import { FoldersIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { FoldersDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusFolder } from './interfaces';

@Service()
export class FoldersDataDiffer extends DataDiffer<DirectusFolder> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataLoader: FoldersDataLoader,
    dataClient: FoldersDataClient,
    dataMapper: FoldersDataMapper,
    idMapper: FoldersIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, FOLDERS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
