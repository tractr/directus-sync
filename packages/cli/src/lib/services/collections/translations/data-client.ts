import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createTranslation,
  deleteTranslation,
  readTranslations,
  updateTranslation,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusTranslation } from './interfaces';

@Service()
export class TranslationsDataClient extends DataClient<DirectusTranslation> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand(itemId: number) {
    return deleteTranslation(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusTranslation>) {
    return createTranslation(item);
  }

  protected getQueryCommand(query: Query<DirectusTranslation>) {
    return readTranslations(query);
  }

  protected getUpdateCommand(
    itemId: number,
    diffItem: Partial<WithoutIdAndSyncId<DirectusTranslation>>,
  ) {
    return updateTranslation(itemId, diffItem);
  }
}
