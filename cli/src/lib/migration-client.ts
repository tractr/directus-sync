import {
  authentication,
  AuthenticationClient,
  createDirectus,
  DirectusClient,
  rest,
  RestClient,
} from '@directus/sdk';
import {logger} from "./logger";

export class MigrationClient {
  protected static instance: MigrationClient;

  protected readonly client: DirectusClient<any> &
    RestClient<any> &
    AuthenticationClient<any>;

  protected isLogged = false;

  protected refreshToken: string | undefined;

  protected constructor() {
    this.client = this.createClient();
  }

  protected createClient() {
    const { DIRECTUS_URL } = process.env;
    if (!DIRECTUS_URL) {
      throw new Error('Missing Directus URL');
    }
    return createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
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
  }

  protected async logout() {
    if (this.refreshToken) {
      this.client.setToken(this.refreshToken);
      await this.client.logout().catch((error) => {
        logger.warn(error);
      });
    }
    this.isLogged = false;
  }

  protected static getInstance() {
    if (!MigrationClient.instance) {
      MigrationClient.instance = new MigrationClient();
    }
    return MigrationClient.instance;
  }

  static async get() {
    const instance = MigrationClient.getInstance();
    if (!instance.isLogged) {
      await instance.login();
    }
    return MigrationClient.getInstance().client;
  }

  static async close() {
    const instance = MigrationClient.getInstance();
    if (instance.isLogged) {
      await instance.logout();
    }
  }
}
