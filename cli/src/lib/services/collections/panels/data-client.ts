import { DataClient, WithoutIdAndSyncId } from '../base';
import {
  createPanel,
  deletePanel,
  DirectusPanel,
  Query,
  readPanels,
  updatePanel,
} from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';

@Service()
export class PanelsDataClient extends DataClient<
  DirectusPanel<object>
> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deletePanel(itemId);
  }

  protected getInsertCommand(
    item: WithoutIdAndSyncId<DirectusPanel<object>>,
  ) {
    return createPanel(item);
  }

  protected getQueryCommand(query: Query<DirectusPanel<object>, object>) {
    return readPanels(query);
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusPanel<object>>>,
  ) {
    return updatePanel(itemId, diffItem);
  }
}
