import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createFolder,
  deleteFolder,
  readFolders,
  updateFolder,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusFolder } from './interfaces';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { FOLDERS_COLLECTION } from './constants';

@Service()
export class FoldersDataClient extends DataClient<DirectusFolder> {
  constructor(@Inject(LOGGER) baseLogger: pino.Logger, migrationClient: MigrationClient) {
    super(getChildLogger(baseLogger, FOLDERS_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteFolder(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusFolder>) {
    return createFolder(item);
  }

  protected getQueryCommand(query: Query<DirectusFolder>) {
    return readFolders(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusFolder>>,
  ) {
    return updateFolder(itemId, diffItem);
  }
}
