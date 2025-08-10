import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createPanel,
  deletePanel,
  readPanels,
  updatePanel,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusPanel } from './interfaces';
import { LoggerService } from '../../logger';
import { PANELS_COLLECTION } from './constants';

@Service()
export class PanelsDataClient extends DataClient<DirectusPanel> {
  constructor(loggerService: LoggerService, migrationClient: MigrationClient) {
    super(loggerService.getChild(PANELS_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deletePanel(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusPanel>) {
    return createPanel(item);
  }

  protected getQueryCommand(query: Query<DirectusPanel>) {
    return readPanels(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusPanel>>,
  ) {
    return updatePanel(itemId, diffItem);
  }
}
