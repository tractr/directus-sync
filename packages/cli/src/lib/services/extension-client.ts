import createHttpError from 'http-errors';
import { MigrationClient } from './migration-client';
import { Cacheable } from 'typescript-cacheable';

/**
 * This class provides an interface to interact with the Directus extension sync endpoints.
 */
export abstract class ExtensionClient {
  protected readonly extensionUri = '/directus-extension-sync';

  constructor(protected readonly migrationClient: MigrationClient) {}

  protected async fetch<T = unknown>(
    uri: string,
    method: RequestInit['method'] = 'GET',
    payload: unknown = undefined,
    options: RequestInit = {},
  ): Promise<T> {
    const { url, token } = await this.getUrlAndToken();
    const response = await (
      await this.getFetch()
    )(`${url}${this.extensionUri}${uri}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method,
      body: payload ? JSON.stringify(payload) : null,
      ...options,
    });
    if (!response.ok) {
      let error;
      try {
        const payload: Error = await response.json();
        error = createHttpError(response.status, payload.message);
      } catch (e) {
        if (response.status === 404 && response.statusText === 'Not Found') {
          error = createHttpError(
            response.status,
            `${response.statusText}: Did you add directus-extension-sync to Directus? Please check the version of the extension as well.`,
          );
        } else {
          error = createHttpError(response.status, response.statusText);
        }
      }
      throw error;
    } else {
      try {
        return (await response.json()) as T;
      } catch {
        return (await response.text()) as T;
      }
    }
  }

  @Cacheable()
  protected async getUrlAndToken() {
    const directus = await this.migrationClient.get();
    //Remove trailing slash
    const url = directus.url.toString().replace(/\/$/, '');
    const token = await directus.getToken();
    if (!token) {
      throw new Error('Cannot get token from Directus');
    }
    return { url, token };
  }

  @Cacheable()
  protected async getFetch() {
    const directus = await this.migrationClient.get();
    return directus.globals.fetch as typeof fetch;
  }
}
