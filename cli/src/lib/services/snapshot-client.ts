import {Inject, Service} from "typedi";
import {MigrationClient} from "./migration-client";
import {schemaSnapshot, SchemaSnapshotOutput} from "@directus/sdk";
import {writeFileSync} from "fs";
import path from "path";

@Service()
export class SnapshotClient {

    protected readonly filePath: string;

    constructor(@Inject('directusSnapshotPath') dumpPath: string,
                protected readonly migrationClient: MigrationClient) {
        this.filePath = path.join(dumpPath, `snapshot.json`);
    }

    async saveSnapshot() {
        const snapshot = await this.getSnapshot();
        await this.saveData(snapshot);
    }

    /**
     * Save the data to the dump file. The data is passed through the data transformer.
     */
    saveData(data: SchemaSnapshotOutput) {
        writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    }

    protected async getSnapshot() {
        const directus = await this.migrationClient.getClient();
        return await directus.request(schemaSnapshot());
    }
}