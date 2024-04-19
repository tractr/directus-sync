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
  serverPing,
} from '@directus/sdk';
import { SystemCollection } from './interfaces/index.js';

type Collections = object;

export interface IdMap {
  id: number;
  table: string;
  sync_id: string;
  local_id: string;
  created_at: Date;
}

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

  protected adminEmail: string | undefined;
  protected adminPassword: string | undefined;

  protected isLogged = false;

  protected readonly client: BaseDirectusClient<Collections> &
    RestClient<Collections> &
    AuthenticationClient<Collections>;

  constructor(protected readonly url: string) {
    this.client = this.createClient();
  }

  get() {
    return this.client;
  }

  setAdminCredentials(email: string, password: string) {
    this.adminEmail = email;
    this.adminPassword = password;
  }

  async loginAsAdmin() {
    if (!this.adminEmail || !this.adminPassword) {
      throw new Error('Admin credentials are not set');
    }
    const token = await this.client.login(this.adminEmail, this.adminPassword);
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

  async createUser(
    key: keyof DirectusClient['users'],
    override: Partial<DirectusUser<Collections>> = {},
  ) {
    return (await this.client.request(
      createUser({
        ...this.users[key],
        ...override,
      }),
    )) as DirectusUser<Collections>;
  }

  async me() {
    return (await this.client.request(readMe())) as DirectusUser<Collections>;
  }

  async ping() {
    return this.client.request(serverPing());
  }

  protected createClient() {
    return createDirectus<Collections>(this.getUrl())
      .with(rest())
      .with(authentication());
  }

  getUrl() {
    return this.url;
  }

  async getSyncIdMaps(table: SystemCollection) {
    const response = await fetch(
      `${this.getUrl()}/directus-extension-sync/table/${table}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${await this.requireToken()}`,
        },
      },
    );
    if (response.status !== 200) {
      throw new Error(await response.text());
    }
    const data: IdMap[] = await response.json();
    return data;
  }

  async getByLocalId(table: SystemCollection, localId: string | number) {
    const response = await fetch(
      `${this.getUrl()}/directus-extension-sync/table/${table}/local_id/${localId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${await this.requireToken()}`,
        },
      },
    );
    if (response.status !== 200) {
      throw new Error(await response.text());
    }
    const data: IdMap = await response.json();
    return data;
  }
}
