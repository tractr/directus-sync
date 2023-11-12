import {
  authentication,
  AuthenticationClient,
  createDirectus,
  DirectusClient,
  rest,
  RestClient,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { DIRECTUS_CONFIG, LOGGER } from '../constants';
import type { DirectusConfig } from '../config';

@Service()
export class MigrationClient {
  protected readonly client: DirectusClient<any> &
    RestClient<any> &
    AuthenticationClient<any>;

  constructor(
    @Inject(DIRECTUS_CONFIG) protected readonly config: DirectusConfig,
    @Inject(LOGGER) protected readonly logger: pino.Logger,
  ) {
    this.client = this.createClient();
  }

  get() {
    return this.client;
  }

  protected createClient() {
    const client = createDirectus(this.config.url)
      .with(rest())
      .with(authentication());
    client.setToken(this.config.token);
    return client;
  }
}
