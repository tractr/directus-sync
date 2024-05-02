import { MigrationClient } from '../../migration-client';
import { ExtensionClient } from '../../extension-client';

export interface IdMap {
  id: number;
  table: string;
  sync_id: string;
  local_id: string;
  created_at: Date;
}

export abstract class IdMapperClient extends ExtensionClient {
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
    migrationClient: MigrationClient,
    protected readonly table: string,
  ) {
    super(migrationClient);
  }

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
