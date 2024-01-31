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

@Service()
export class FoldersDataClient extends DataClient<DirectusFolder> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
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
