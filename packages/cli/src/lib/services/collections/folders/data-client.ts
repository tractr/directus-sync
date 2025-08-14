import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createFolder,
  deleteFolder,
  readFolders,
  updateFolder,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusFolder } from './interfaces';
import { LoggerService } from '../../logger';
import { FOLDERS_COLLECTION } from './constants';

@Service()
export class FoldersDataClient extends DataClient<DirectusFolder> {
  constructor(loggerService: LoggerService, migrationClient: MigrationClient) {
    super(loggerService.getChild(FOLDERS_COLLECTION), migrationClient);
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
