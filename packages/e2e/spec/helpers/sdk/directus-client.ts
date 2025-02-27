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
  readActivities,
} from '@directus/sdk';
import { SystemCollection } from './interfaces/index.js';
import getenv from 'getenv';

const DIRECTUS_COLLECTIONS_PREFIX = 'directus_';
const CUSTOM_COLLECTIONS_PREFIX = 'items:';

// TODO: Improve directus collections type
/* eslint-disable @typescript-eslint/no-explicit-any */
type Collections = any;

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

  protected isLogged = false;

  protected client: BaseDirectusClient<Collections> &
    RestClient<Collections> &
    AuthenticationClient<Collections>;

  constructor(protected readonly url: string) {
    this.client = this.createClient();
  }

  reset() {
    this.client = this.createClient();
  }

  get() {
    return this.client;
  }
  async loginAsAdmin() {
    const token = await this.client.login(
      getenv.string('ADMIN_EMAIL'),
      getenv.string('ADMIN_PASSWORD'),
    );
    await this.client.setToken(token.access_token);
    this.isLogged = true;
    return token;
  }
  async loginAsUser(email: string, password: string) {
    const token = await this.client.login(email, password);
    await this.client.setToken(token.access_token);
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
    return createDirectus<Collections>(this.url)
      .with(rest())
      .with(authentication());
  }

  protected getStoredTableNameForSeedCollection(collection: string) {
    return collection.startsWith(DIRECTUS_COLLECTIONS_PREFIX)
      ? collection.slice(DIRECTUS_COLLECTIONS_PREFIX.length)
      : `${CUSTOM_COLLECTIONS_PREFIX}:${collection}`;
  }

  async getSyncIdMaps(table: SystemCollection) {
    return this.getSyncIdMapsRoutine(table);
  }

  async getSyncIdMapsForSeed(collection: string) {
    const storedTableName =
      this.getStoredTableNameForSeedCollection(collection);
    return this.getSyncIdMapsRoutine(storedTableName);
  }

  protected async getSyncIdMapsRoutine(table: string) {
    const response = await fetch(
      `${this.url}/directus-extension-sync/table/${table}`,
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
    return this.getByLocalIdRoutine(table, localId);
  }

  async getByLocalIdForSeed(collection: string, localId: string | number) {
    const storedTableName =
      this.getStoredTableNameForSeedCollection(collection);
    return this.getByLocalIdRoutine(storedTableName, localId);
  }

  protected async getByLocalIdRoutine(table: string, localId: string | number) {
    const response = await fetch(
      `${this.url}/directus-extension-sync/table/${table}/local_id/${localId}`,
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

  async getActivities(from: Date | number = Date.now(), limit = -1) {
    const fromDate = new Date(from);
    return this.client.request(
      readActivities({
        sort: 'timestamp',
        limit,
        filter: {
          timestamp: {
            _gte: fromDate.toISOString(),
          },
        },
      }),
    );
  }
}
