import {Inject, Service} from "typedi";
import {MigrationClient} from "../migration-client";
import {schemaSnapshot} from "@directus/sdk";
import {writeFileSync} from "fs";
import path from "path";
import type {SnapshotConfig} from "../../config";
import {Snapshot} from "./interfaces";
import {mkdirpSync, removeSync} from "fs-extra";
import {LOGGER, SNAPSHOT_CONFIG} from "../../constants";
import pino from "pino";
import {getChildLogger} from "../../helpers";

@Service()
export class SnapshotClient {

    protected readonly dumpPath: string;

    protected readonly splitFiles: boolean;

    protected readonly logger: pino.Logger

    constructor(@Inject(SNAPSHOT_CONFIG) config: SnapshotConfig,
                @Inject(LOGGER) baseLogger: pino.Logger,
                protected readonly migrationClient: MigrationClient) {
        this.logger = getChildLogger(baseLogger, 'snapshot');
        this.dumpPath = config.dumpPath
        this.splitFiles = config.splitFiles;
    }

    async saveSnapshot() {
        const snapshot = await this.getSnapshot();
        const numberOfFiles = this.saveData(snapshot);
        this.logger.info(`Saved ${numberOfFiles} file${numberOfFiles>1?'s':''} to ${this.dumpPath}`);
    }

    /**
     * Save the data to the dump file. The data is passed through the data transformer.
     * Returns the number of saved items.
     */
    protected saveData(data: Snapshot): number {
        // Clean directory
        removeSync(this.dumpPath);
        mkdirpSync(this.dumpPath);
        // Save data
        if (this.splitFiles) {
            const files = this.decomposeData(data);
            for (const file of files) {
                const filePath = path.join(this.dumpPath, file.path);
                const dirPath = path.dirname(filePath);
                mkdirpSync(dirPath);
                writeFileSync(filePath, JSON.stringify(file.content, null, 2));
            }
            return files.length;
        } else {
            const filePath = path.join(this.dumpPath, 'snapshot.json');
            writeFileSync(filePath, JSON.stringify(data, null, 2));
            return 1;
        }
    }

    /**
     * Decompose the snapshot into a collection of files.
     */
    protected decomposeData(data: Snapshot): { path: string, content: any }[] {
        const { collections, fields, relations, ...info } = data;

        const files: { path: string, content: any }[] = [
            { path: 'info.json', content: info },
        ];

        // Split collections
        for (const collection of collections) {
            files.push({ path: `collections/${collection.collection}.json`, content: collection });
        }
        // Split fields
        for (const field of fields) {
            files.push({ path: `fields/${field.collection}/${field.field}.json`, content: field });
        }
        // Split relations
        for (const relation of relations) {
            files.push({ path: `relations/${relation.collection}/${relation.field}.json`, content: relation });
        }

        return files;
    }

    protected async getSnapshot() {
        const directus = await this.migrationClient.getClient();
        return await directus.request<Snapshot>(schemaSnapshot()); // Get better types
    }


}
