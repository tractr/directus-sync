import { DataDiffer } from '../base';
import { Service } from 'typedi';
import { PANELS_COLLECTION } from './constants';
import { PanelsDataLoader } from './data-loader';
import { PanelsDataClient } from './data-client';
import { PanelsIdMapperClient } from './id-mapper-client';
import { LoggerService } from '../../logger';
import { PanelsDataMapper } from './data-mapper';
import { DirectusPanel } from './interfaces';

@Service()
export class PanelsDataDiffer extends DataDiffer<DirectusPanel> {
  constructor(
    loggerService: LoggerService,
    dataLoader: PanelsDataLoader,
    dataClient: PanelsDataClient,
    dataMapper: PanelsDataMapper,
    idMapper: PanelsIdMapperClient,
  ) {
    super(
      loggerService.getChild(PANELS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
