import { DataDiffer } from '../base';
import { Inject, Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';
import pino from 'pino';
import { PanelsDataLoader } from './data-loader';
import { PanelsDataClient } from './data-client';
import { PanelsIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { PanelsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusPanel } from './interfaces';

@Service()
export class PanelsDataDiffer extends DataDiffer<DirectusPanel> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataLoader: PanelsDataLoader,
    dataClient: PanelsDataClient,
    dataMapper: PanelsDataMapper,
    idMapper: PanelsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, PANELS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
