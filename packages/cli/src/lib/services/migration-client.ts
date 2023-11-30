import {
  authentication,
  AuthenticationClient,
  createDirectus,
  DirectusClient,
  readMe,
  rest,
  RestClient,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { LOGGER } from '../constants';
import { ConfigService, isDirectusConfigWithToken } from './config';

@Service()
export class MigrationClient {
  protected adminRoleId: string | undefined;

  protected client:
    | (DirectusClient<object> &
        RestClient<object> &
        AuthenticationClient<object>)
    | undefined;

  constructor(
    protected readonly config: ConfigService,
    @Inject(LOGGER) protected readonly logger: pino.Logger,
  ) {}

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

  protected async createClient() {
    const config = this.config.getDirectusConfig();
    const client = createDirectus(config.url)
      .with(rest())
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
