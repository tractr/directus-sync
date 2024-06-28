import {
  authentication,
  AuthenticationClient,
  clearCache,
  ClientOptions,
  createDirectus,
  DirectusClient,
  readMe,
  rest,
  RestClient,
  RestConfig,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { LOGGER } from '../constants';
import { ConfigService, isDirectusConfigWithToken } from './config';
import { getChildLogger } from '../helpers';

@Service()
export class MigrationClient {
  protected readonly logger: pino.Logger;

  protected adminRoleId: string | undefined;

  protected client:
    | (DirectusClient<object> &
        RestClient<object> &
        AuthenticationClient<object>)
    | undefined;

  constructor(
    protected readonly config: ConfigService,
    @Inject(LOGGER) baseLogger: pino.Logger,
  ) {
    this.logger = getChildLogger(baseLogger, 'migration-client');
  }

  async get() {
    if (!this.client) {
      this.client = await this.createClient();
    }
    return this.client;
  }

  /**
   * This method return the role of the current user as the Admin role
   */
  async getAdminRoleId() {
    if (!this.adminRoleId) {
      const directus = await this.get();
      const { role } = await directus.request(
        readMe({
          fields: ['role'],
        }),
      );
      this.adminRoleId = role as string;
    }
    return this.adminRoleId;
  }

  /**
   * This method clears the cache of the Directus instance
   */
  async clearCache() {
    const directus = await this.get();
    await directus.request(clearCache());
    this.logger.debug('Cache cleared');
  }

  protected async createClient() {
    const config = this.config.getDirectusConfig();
    const client = createDirectus(
      config.url,
      config.clientConfig as ClientOptions | undefined,
    )
      .with(rest(config.restConfig as RestConfig | undefined))
      .with(authentication());

    // If the token is already set, return it
    let token: string;
    if (isDirectusConfigWithToken(config)) {
      token = config.token;
    }
    // Otherwise, login and return the token
    else {
      const response = await client.login(config.email, config.password);

      // Check if the token is defined
      if (!response.access_token) {
        throw new Error('Cannot login to Directus');
      }

      token = response.access_token;
    }

    client.setToken(token);
    return client;
  }
}
