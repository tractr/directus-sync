import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createExtension,
  deleteExtension,
  readExtensions,
  updateExtension,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusExtension } from './interfaces';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { EXTENSIONS_COLLECTION } from './constants';

@Service()
export class ExtensionsDataClient extends DataClient<DirectusExtension> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, EXTENSIONS_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deleteExtension(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusExtension>) {
    return createExtension(item);
  }

  protected getQueryCommand() {
    return readExtensions();
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusExtension>>,
  ) {
    return updateExtension(itemId, diffItem);
  }
}
