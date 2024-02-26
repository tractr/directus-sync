import { DataDiffer } from '../base';
import { Inject, Service } from 'typedi';
import { PRESETS_COLLECTION } from './constants';
import pino from 'pino';
import { PresetsDataLoader } from './data-loader';
import { PresetsDataClient } from './data-client';
import { PresetsIdMapperClient } from './id-mapper-client';
import { getChildLogger } from '../../../helpers';
import { PresetsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusPreset } from './interfaces';

@Service()
export class PresetsDataDiffer extends DataDiffer<DirectusPreset> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataLoader: PresetsDataLoader,
    dataClient: PresetsDataClient,
    dataMapper: PresetsDataMapper,
    idMapper: PresetsIdMapperClient,
  ) {
    super(
      getChildLogger(baseLogger, PRESETS_COLLECTION),
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
    );
  }
}
