import { DataDiffer } from '../base';

import { Service } from 'typedi';
import { FOLDERS_COLLECTION } from './constants';
import { FoldersDataLoader } from './data-loader';
import { FoldersDataClient } from './data-client';
import { FoldersIdMapperClient } from './id-mapper-client';
import { LoggerService } from '../../logger';
import { FoldersDataMapper } from './data-mapper';
import { DirectusFolder } from './interfaces';

@Service()
export class FoldersDataDiffer extends DataDiffer<DirectusFolder> {
  constructor(
    loggerService: LoggerService,
    dataLoader: FoldersDataLoader,
    dataClient: FoldersDataClient,
    dataMapper: FoldersDataMapper,
    idMapper: FoldersIdMapperClient,
  ) {
    super(
      loggerService.getChild(FOLDERS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
