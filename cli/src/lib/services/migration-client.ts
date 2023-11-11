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

@Service()
export class MigrationClient {
  protected readonly client: DirectusClient<any> &
    RestClient<any> &
    AuthenticationClient<any>;

  protected isLogged = false;

  protected userId: number | undefined;

  protected refreshToken: string | undefined;

  constructor(@Inject(LOGGER) protected readonly logger: pino.Logger) {
    this.client = this.createClient();
  }

  protected createClient() {
    const { DIRECTUS_URL } = process.env;
    if (!DIRECTUS_URL) {
      throw new Error('Missing Directus URL');
    }
    return createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  }

  async getClient() {
    if (!this.isLogged) {
      await this.login();
    }
    return this.client;
  }

  protected async login() {
    const { DIRECTUS_EMAIL, DIRECTUS_PASSWORD, DIRECTUS_TOKEN } = process.env;
    if (DIRECTUS_EMAIL && DIRECTUS_PASSWORD) {
      const token = await this.client.login(DIRECTUS_EMAIL, DIRECTUS_PASSWORD);
      this.refreshToken = token.refresh_token || undefined;
      this.client.setToken(token.access_token);
    } else if (DIRECTUS_TOKEN) {
      this.client.setToken(DIRECTUS_TOKEN);
    } else {
      throw new Error('Missing Directus credentials');
    }
    this.isLogged = true;
    delete this.userId;
  }

  async logout() {
    if (this.refreshToken && this.isLogged) {
      this.client.setToken(this.refreshToken);
      await this.client.logout().catch((error) => {
        this.logger.warn(error);
      });
    }
    this.isLogged = false;
    delete this.refreshToken;
    delete this.userId;
  }

  async getUserId() {
    if (!this.userId) {
      const { id } = await this.client.request(readMe());
      this.userId = id;
    }
    return this.userId;
  }
}
