import { Command, DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createTranslation,
  deleteTranslation,
  readTranslations,
  updateTranslation,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusTranslation } from './interfaces';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { TRANSLATIONS_COLLECTION } from './constants';

@Service()
export class TranslationsDataClient extends DataClient<DirectusTranslation> {
  constructor(@Inject(LOGGER) baseLogger: pino.Logger, migrationClient: MigrationClient) {
    super(getChildLogger(baseLogger, TRANSLATIONS_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteTranslation(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusTranslation>) {
    return createTranslation(item);
  }

  protected getQueryCommand(query: Query<DirectusTranslation>) {
    return readTranslations(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusTranslation>>,
  ) {
    // Workaround for error "Invalid payload. Duplicate key and language combination."
    // when updating key and language at the same time.
    if (diffItem.key && diffItem.language) {
      const { key, ...rest } = diffItem; // Remove key from diffItem
      // Update in two steps
      return [
        updateTranslation(itemId, { key }),
        updateTranslation(itemId, rest),
      ] as [Command<DirectusTranslation>, Command<DirectusTranslation>];
    }
    return updateTranslation(itemId, diffItem);
  }
}
