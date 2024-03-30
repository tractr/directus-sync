import {
  authentication,
  AuthenticationClient,
  createDirectus,
  createUser,
  DirectusClient as BaseDirectusClient,
  DirectusUser,
  readMe,
  rest,
  RestClient,
} from '@directus/sdk';
import * as getenv from 'getenv';

type Collections = object;

export class DirectusClient {
  protected readonly users = {
    one: {
      first_name: 'One',
      last_name: 'Dude',
      email: 'one@example.com',
      password: 'one_password',
    },
    two: {
      first_name: 'Two',
      last_name: 'Johnson',
      email: 'two@example.com',
      password: 'two_password',
    },
  };

  protected isLogged = false;

  protected readonly client: BaseDirectusClient<Collections> &
    RestClient<Collections> &
    AuthenticationClient<Collections>;

  constructor(protected readonly port?: number) {
    this.client = this.createClient();
  }

  get() {
    return this.client;
  }

  async loginAsAdmin() {
    const adminEmail = getenv.string('DIRECTUS_ADMIN_EMAIL');
    const adminPassword = getenv.string('DIRECTUS_ADMIN_PASSWORD');
    const token = await this.client.login(
      adminEmail,
      adminPassword,
    );
    this.client.setToken(token.access_token);
    this.isLogged = true;
    return token;
  }

  async loginAsUser(email: string, password: string) {
    const token = await this.client.login(email, password);
    this.client.setToken(token.access_token);
    this.isLogged = true;
    return token;
  }

  async loginAs(key: keyof DirectusClient['users']) {
    const { email, password } = this.users[key];
    return this.loginAsUser(email, password);
  }

  async logout() {
    await this.client.logout().catch(() => null);
    this.isLogged = false;
  }

  getToken(): Promise<string | null> {
    return this.client.getToken();
  }

  async requireToken() {
    const token = await this.getToken();
    if (!token) {
      throw new Error('Token is required');
    }
    return token;
  }

  async createUser(key: keyof DirectusClient['users'], override: Partial<DirectusUser<Collections>> = {}) {
    return (await this.client.request(
      createUser({
        ...this.users[key],
        ...override
      }),
    )) as DirectusUser<Collections>;
  }

  async me() {
    return (await this.client.request(readMe())) as DirectusUser<Collections>;
  }

  protected createClient() {
    return createDirectus<Collections>(this.getUrl())
      .with(rest())
      .with(authentication());
  }

  getUrl() {
    const host = getenv.string('DIRECTUS_HOST', 'localhost');
    return `http://${host}:${this.getPort()}`;
  }

  protected getPort() {
    return getenv.int('DIRECTUS_PORT', this.port);
  }
}
