import { IdMapperClient } from '../base';
import { Inject, Service } from 'typedi';
import { FOLDERS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';

@Service()
export class FoldersIdMapperClient extends IdMapperClient {
  constructor(
    migrationClient: MigrationClient,
    @Inject(LOGGER) baseLogger: pino.Logger,
  ) {
    super(
      migrationClient,
      getChildLogger(baseLogger, FOLDERS_COLLECTION),
      FOLDERS_COLLECTION,
    );
  }
}
