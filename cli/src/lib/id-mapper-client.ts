import {Axios} from "axios";

export type IdMap = {
    id: number;
    table: string;
    sync_id: string;
    local_id: string;
    created_at: Date;
};

export class IdMapperClient {

    protected client: Axios;

    protected constructor(protected readonly table: string) {
        this.client = this.createClient();
    }

    async getBySyncId(syncId: string): Promise<IdMap | undefined> {
        const {data} = await this.client.get<IdMap[]>(`/table/${this.table}/sync_id/${syncId}`);
        return data.length ? data[0] : undefined;
    }

    async getByLocalId(localId: string | number): Promise<IdMap | undefined> {
        const {data} = await this.client.get<IdMap[]>(`/table/${this.table}/local_id/${localId}`);
        return data.length ? data[0] : undefined;
    }

    async getAll(): Promise<IdMap[]> {
        const {data} = await this.client.get<IdMap[]>(`/table/${this.table}`);
        return data;
    }

    async create(localId: string | number): Promise<string> {
        const {data} = await this.client.post<{ sync_id: string }>(`/table/${this.table}`, {
            table: this.table,
            local_id: localId
        });
        return data.sync_id;
    }

    async removeBySyncId(syncId: string): Promise<void> {
        await this.client.delete(`/table/${this.table}/sync_id/${syncId}`);
    }

    async removeByLocalId(localId: string | number): Promise<void> {
        await this.client.delete(`/table/${this.table}/local_id/${localId}`);
    }

    protected createClient() {
        const {DIRECTUS_URL, DIRECTUS_TOKEN} = process.env;
        if (!DIRECTUS_URL) {
            throw new Error('Missing Directus URL');
        }
        if (!DIRECTUS_TOKEN) {
            throw new Error('Missing Directus Token');
        }
        return new Axios({
            baseURL: DIRECTUS_URL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${DIRECTUS_TOKEN}`
            }
        });
    }
}
