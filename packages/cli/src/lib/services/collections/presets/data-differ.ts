import { DataDiffer } from '../base';
import { Service } from 'typedi';
import { PRESETS_COLLECTION } from './constants';
import { PresetsDataLoader } from './data-loader';
import { PresetsDataClient } from './data-client';
import { PresetsIdMapperClient } from './id-mapper-client';
import { LoggerService } from '../../logger';
import { PresetsDataMapper } from './data-mapper';
import { DirectusPreset } from './interfaces';

@Service()
export class PresetsDataDiffer extends DataDiffer<DirectusPreset> {
  constructor(
    loggerService: LoggerService,
    dataLoader: PresetsDataLoader,
    dataClient: PresetsDataClient,
    dataMapper: PresetsDataMapper,
    idMapper: PresetsIdMapperClient,
  ) {
    super(
      loggerService.getChild(PRESETS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
