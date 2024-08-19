import { IdMapperClient } from '../base';
import { Inject, Service } from 'typedi';
import { POLICIES_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';

@Service()
export class PoliciesIdMapperClient extends IdMapperClient {
  constructor(
    migrationClient: MigrationClient,
    @Inject(LOGGER) baseLogger: pino.Logger,
  ) {
    super(
      migrationClient,
      getChildLogger(baseLogger, POLICIES_COLLECTION),
      POLICIES_COLLECTION,
    );
  }
}
