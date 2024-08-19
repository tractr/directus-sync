import { IdMapperClient } from '../base';
import { Inject, Service } from 'typedi';
import { SETTINGS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';

@Service()
export class SettingsIdMapperClient extends IdMapperClient {
  constructor(
    migrationClient: MigrationClient,
    @Inject(LOGGER) baseLogger: pino.Logger,
  ) {
    super(
      migrationClient,
      getChildLogger(baseLogger, SETTINGS_COLLECTION),
      SETTINGS_COLLECTION,
    );
  }
}
