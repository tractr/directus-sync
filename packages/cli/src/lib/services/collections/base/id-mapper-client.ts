import createHttpError from 'http-errors';
import { MigrationClient } from '../../migration-client';
import { Cacheable } from 'typescript-cacheable';

export interface IdMap {
  id: number;
  table: string;
  sync_id: string;
  local_id: string;
  created_at: Date;
}

export abstract class IdMapperClient {
  protected readonly extensionUri = '/directus-extension-sync';

  /**
   * Cache for id maps
   */
  protected cache: {
    bySyncId: Map<string, IdMap>;
    byLocalId: Map<string, IdMap>;
  } = {
    bySyncId: new Map(),
    byLocalId: new Map(),
  };

  constructor(
    protected readonly migrationClient: MigrationClient,
    protected readonly table: string,
  ) {}

  async getBySyncId(syncId: string): Promise<IdMap | undefined> {
    // Try to get from cache
    const cached = this.cache.bySyncId.get(syncId);
    if (cached) {
      return cached;
    }
    // Try to get from server
    const idMap = await this.fetch<IdMap>(
      `/table/${this.table}/sync_id/${syncId}`,
    ).catch((error) => {
      if (error.message === 'No id map found') {
        return undefined;
      }
      throw error;
    });
    // Add to cache
    if (idMap) {
      this.addToCache(idMap);
    }
    return idMap;
  }

  async getByLocalId(localId: string): Promise<IdMap | undefined> {
    // Try to get from cache
    const cached = this.cache.byLocalId.get(localId);
    if (cached) {
      return cached;
    }
    // Try to get from server
    const idMap = await this.fetch<IdMap>(
      `/table/${this.table}/local_id/${localId}`,
    ).catch((error) => {
      if (error.message === 'No id map found') {
        return undefined;
      }
      throw error;
    });
    // Add to cache
    if (idMap) {
      this.addToCache(idMap);
    }
    return idMap;
  }

  async getAll(): Promise<IdMap[]> {
    const all = await this.fetch<IdMap[]>(`/table/${this.table}`);
    // Add to cache
    all.forEach((idMap) => {
      this.addToCache(idMap);
    });
    return all;
  }

  async create(localId: string | number, syncId?: string): Promise<string> {
    const data = await this.fetch<{ sync_id: string }>(
      `/table/${this.table}`,
      'POST',
      {
        table: this.table,
        local_id: localId,
        sync_id: syncId,
      },
    );
    return data.sync_id;
  }

  async removeBySyncId(syncId: string): Promise<void> {
    await this.fetch(`/table/${this.table}/sync_id/${syncId}`, 'DELETE');
    this.removeCacheBySyncId(syncId);
  }

  async removeByLocalId(localId: string): Promise<void> {
    await this.fetch(`/table/${this.table}/local_id/${localId}`, 'DELETE');
    this.removeCacheByLocalId(localId);
  }

  // Cache
  clearCache() {
    this.cache.byLocalId.clear();
    this.cache.bySyncId.clear();
  }

  //-----------------------------------------------

  protected async fetch<T = unknown>(
    uri: string,
    method: RequestInit['method'] = 'GET',
    payload: unknown = undefined,
    options: RequestInit = {},
  ): Promise<T> {
    const { url, token } = await this.getUrlAndToken();
    const response = await fetch(`${url}${this.extensionUri}${uri}`, {
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
            `${response.statusText}: Did you add directus-extension-sync to Directus?`,
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

  protected addToCache(idMap: IdMap) {
    this.cache.bySyncId.set(idMap.sync_id, idMap);
    this.cache.byLocalId.set(idMap.local_id, idMap);
  }

  protected removeFromCache(idMap: IdMap) {
    this.cache.bySyncId.delete(idMap.sync_id);
    this.cache.byLocalId.delete(idMap.local_id);
  }

  protected removeCacheByLocalId(localId: string) {
    const idMap = this.cache.byLocalId.get(localId);
    if (idMap) {
      this.removeFromCache(idMap);
    }
  }

  protected removeCacheBySyncId(syncId: string) {
    const idMap = this.cache.bySyncId.get(syncId);
    if (idMap) {
      this.removeFromCache(idMap);
    }
  }
}
