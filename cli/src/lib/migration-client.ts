import {
  authentication,
  AuthenticationClient,
  createDirectus,
  DirectusClient,
  rest,
  RestClient,
} from '@directus/sdk';

export class MigrationClient {
  protected static instance: MigrationClient;

  protected readonly client: DirectusClient<any> &
    RestClient<any> &
    AuthenticationClient<any>;

  protected isLogged = false;

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
    const { DIRECTUS_EMAIL, DIRECTUS_PASSWORD } = process.env;
    if (!DIRECTUS_EMAIL || !DIRECTUS_PASSWORD) {
      throw new Error('Missing Directus credentials');
    }
    const token = await this.client.login(DIRECTUS_EMAIL, DIRECTUS_PASSWORD);
    this.client.setToken(token.access_token);
    this.isLogged = true;
  }

  protected async logout() {
    await this.client.logout().catch(() => null);
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
