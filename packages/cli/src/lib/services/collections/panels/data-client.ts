import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createPanel,
  deletePanel,
  readPanels,
  updatePanel,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusPanel } from './interfaces';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { PANELS_COLLECTION } from './constants';

@Service()
export class PanelsDataClient extends DataClient<DirectusPanel> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, PANELS_COLLECTION), migrationClient);
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
