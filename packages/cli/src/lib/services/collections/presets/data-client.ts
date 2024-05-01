import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createPreset,
  deletePreset,
  readPresets,
  updatePreset,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusPreset } from './interfaces';
import deepmerge from 'deepmerge';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { PRESETS_COLLECTION } from './constants';

@Service()
export class PresetsDataClient extends DataClient<DirectusPreset> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, PRESETS_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: number) {
    return deletePreset(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusPreset>) {
    return createPreset(item);
  }

  protected getQueryCommand(query: Query<DirectusPreset>) {
    // Exclude user's personal presets from the dump
    const newQuery = deepmerge(query, {
      filter: {
        user: {
          _null: true,
        },
      },
    });
    return readPresets(newQuery);
  }

  protected getUpdateCommand(
    itemId: number,
    diffItem: Partial<WithoutIdAndSyncId<DirectusPreset>>,
  ) {
    return updatePreset(itemId, diffItem);
  }
}
