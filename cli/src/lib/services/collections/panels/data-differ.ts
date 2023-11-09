import { DataDiffer } from '../base';
import { DirectusPanel } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';
import pino from 'pino';
import { PanelsDataLoader } from './data-loader';
import { PanelsDataClient } from './data-client';
import { PanelsIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { PanelsDataMapper } from './data-mapper';

@Service()
export class PanelsDataDiffer extends DataDiffer<
  DirectusPanel<object>
> {
  constructor(
    @Inject('logger') baseLogger: pino.Logger,
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
