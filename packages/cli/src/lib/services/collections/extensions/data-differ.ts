import { DataDiffer } from '../base';
import { Inject, Service } from 'typedi';
import { EXTENSIONS_COLLECTION } from './constants';
import pino from 'pino';
import { ExtensionsDataLoader } from './data-loader';
import { ExtensionsDataClient } from './data-client';
import { ExtensionsIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { ExtensionsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusExtension } from './interfaces';

@Service()
export class ExtensionsDataDiffer extends DataDiffer<DirectusExtension> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataLoader: ExtensionsDataLoader,
    dataClient: ExtensionsDataClient,
    dataMapper: ExtensionsDataMapper,
    idMapper: ExtensionsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, EXTENSIONS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
