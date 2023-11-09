import { DataMapper } from '../base';
import { DirectusSettings } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { FLOWS_COLLECTION } from '../flows';

@Service()
export class SettingsDataMapper extends DataMapper<DirectusSettings<object>> {
  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION), migrationClient);
  }
}
