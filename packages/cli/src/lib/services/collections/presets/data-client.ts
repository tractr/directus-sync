import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createPreset,
  deletePreset,
  readPresets,
  updatePreset,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusPreset } from './interfaces';

@Service()
export class PresetsDataClient extends DataClient<DirectusPreset> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand(itemId: number) {
    return deletePreset(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusPreset>) {
    return createPreset(item);
  }

  protected getQueryCommand(query: Query<DirectusPreset>) {
    return readPresets(query);
  }

  protected getUpdateCommand(
    itemId: number,
    diffItem: Partial<WithoutIdAndSyncId<DirectusPreset>>,
  ) {
    return updatePreset(itemId, diffItem);
  }
}
