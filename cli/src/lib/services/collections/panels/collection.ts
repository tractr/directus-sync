import 'dotenv/config';
import { DirectusPanel } from '@directus/sdk';
import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { PanelsDataLoader } from './data-loader';
import { PanelsDataClient } from './data-client';
import { PanelsIdMapperClient } from './id-mapper-client';
import { PanelsDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { PANELS_COLLECTION } from './constants';
import { PanelsDataMapper } from './data-mapper';
import {LOGGER} from "../../../constants";

@Service()
export class PanelsCollection extends DirectusCollection<
  DirectusPanel<object>
> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataDiffer: PanelsDataDiffer,
    dataLoader: PanelsDataLoader,
    dataClient: PanelsDataClient,
    dataMapper: PanelsDataMapper,
    idMapper: PanelsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, PANELS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
