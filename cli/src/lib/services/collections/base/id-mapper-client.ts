import createHttpError from 'http-errors';

export type IdMap = {
  id: number;
  table: string;
  sync_id: string;
  local_id: string;
  created_at: Date;
};

export abstract class IdMapperClient {
  protected readonly extensionUri = '/directus-extension-sync';

  constructor(protected readonly table: string) {}

  async getBySyncId(syncId: string): Promise<IdMap | undefined> {
    return await this.fetch<IdMap>(
      `/table/${this.table}/sync_id/${syncId}`,
    ).catch((error) => {
      if (error.message === 'No id map found') {
        return undefined;
      }
      throw error;
    });
  }

  async getByLocalId(localId: string | number): Promise<IdMap | undefined> {
    return await this.fetch<IdMap>(
      `/table/${this.table}/local_id/${localId}`,
    ).catch((error) => {
      if (error.message === 'No id map found') {
        return undefined;
      }
      throw error;
    });
  }

  async getAll(): Promise<IdMap[]> {
    return await this.fetch<IdMap[]>(`/table/${this.table}`);
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
  }

  async removeByLocalId(localId: string | number): Promise<void> {
    await this.fetch(`/table/${this.table}/local_id/${localId}`, 'DELETE');
  }

  protected async fetch<T = any>(
    uri: string,
    method: RequestInit['method'] = 'GET',
    payload: any = undefined,
    options: RequestInit = {},
  ): Promise<T> {
    const { DIRECTUS_URL, DIRECTUS_TOKEN } = process.env;
    if (!DIRECTUS_URL) {
      throw new Error('Missing Directus URL');
    }
    if (!DIRECTUS_TOKEN) {
      throw new Error('Missing Directus Token');
    }
    const response = await fetch(`${DIRECTUS_URL}${this.extensionUri}${uri}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`,
      },
      method,
      body: payload ? JSON.stringify(payload) : null,
      ...options,
    });
    if (!response.ok) {
      let error;
      try {
        const payload = await response.json();
        error = createHttpError(response.status, payload.message);
      } catch (e) {
        error = createHttpError(response.status, response.statusText);
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
}
