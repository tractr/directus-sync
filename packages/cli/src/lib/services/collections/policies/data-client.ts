import { DataClient, Query, WithoutIdAndSyncId } from '../base';
import {
  createPolicy,
  deletePolicy,
  readPolicies,
  updatePolicy,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { DirectusPolicy } from './interfaces';
import { LOGGER } from '../../../constants';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { POLICIES_COLLECTION } from './constants';
import deepmerge from 'deepmerge';

@Service()
export class PoliciesDataClient extends DataClient<DirectusPolicy> {
  constructor(
    @Inject(LOGGER) baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, POLICIES_COLLECTION), migrationClient);
  }

  protected getDeleteCommand(itemId: string) {
    return deletePolicy(itemId);
  }

  protected getInsertCommand(item: WithoutIdAndSyncId<DirectusPolicy>) {
    return createPolicy(item);
  }

  protected getQueryCommand(query: Query<DirectusPolicy>) {
    return readPolicies(
      deepmerge<Query<DirectusPolicy>>(query, {
        fields: ['*', 'roles.role', 'roles.sort'],
      }),
    );
  }

  protected getUpdateCommand(
    itemId: string,
    diffItem: Partial<WithoutIdAndSyncId<DirectusPolicy>>,
  ) {
    return updatePolicy(itemId, diffItem);
  }
}
