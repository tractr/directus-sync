import { IdMapperClient } from '../base';
import { Service } from 'typedi';
import { WEBHOOKS_COLLECTION } from './constants';
import { MigrationClient } from '../../migration-client';

@Service()
export class WebhooksIdMapperClient extends IdMapperClient {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient, WEBHOOKS_COLLECTION);
  }
}
