import { DirectusCollection } from '../base';
import { Service } from 'typedi';
import { PresetsDataLoader } from './data-loader';
import { PresetsDataClient } from './data-client';
import { PresetsIdMapperClient } from './id-mapper-client';
import { PresetsDataDiffer } from './data-differ';
import { LoggerService } from '../../logger';
import { PRESETS_COLLECTION } from './constants';
import { PresetsDataMapper } from './data-mapper';
import { DirectusPreset } from './interfaces';
import { ConfigService } from '../../config';
import { MigrationClient } from '../../migration-client';

@Service()
export class PresetsCollection extends DirectusCollection<DirectusPreset> {
  protected readonly enableCreate = true;
  protected readonly enableUpdate = true;
  protected readonly enableDelete = true;

  constructor(
    loggerService: LoggerService,
    dataDiffer: PresetsDataDiffer,
    dataLoader: PresetsDataLoader,
    dataClient: PresetsDataClient,
    dataMapper: PresetsDataMapper,
    idMapper: PresetsIdMapperClient,
    config: ConfigService,
    migrationClient: MigrationClient,
  ) {
    super(
      loggerService.getChild(PRESETS_COLLECTION),
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
