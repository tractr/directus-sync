import { DirectusCollection } from '../base';
import pino from 'pino';
import { Inject, Service } from 'typedi';
import { PresetsDataLoader } from './data-loader';
import { PresetsDataClient } from './data-client';
import { PresetsIdMapperClient } from './id-mapper-client';
import { PresetsDataDiffer } from './data-differ';
import { getChildLogger } from '../../../helpers';
import { PRESETS_COLLECTION } from './constants';
import { PresetsDataMapper } from './data-mapper';
import { LOGGER } from '../../../constants';
import { DirectusPreset } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class PresetsCollection extends DirectusCollection<DirectusPreset> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    dataDiffer: PresetsDataDiffer,
    dataLoader: PresetsDataLoader,
    dataClient: PresetsDataClient,
    dataMapper: PresetsDataMapper,
    idMapper: PresetsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      getChildLogger(baseLogger, PRESETS_COLLECTION),
      dataDiffer,
      dataLoader,
      dataClient,
      dataMapper,
      idMapper,
      migrationClient,
      {
        hooks: config.getCollectionHooksConfig(PRESETS_COLLECTION),
      },
    );
  }
}
