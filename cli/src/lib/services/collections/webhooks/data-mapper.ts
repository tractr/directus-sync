import { DataMapper } from '../base';
import { DirectusWebhook } from '@directus/sdk';
import { Service } from 'typedi';
import { MigrationClient } from '../../migration-client';

@Service()
export class WebhooksDataMapper extends DataMapper<DirectusWebhook<object>> {
  constructor(migrationClient: MigrationClient) {
    super(migrationClient);
  }
}
