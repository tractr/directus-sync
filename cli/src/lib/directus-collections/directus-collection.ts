import 'dotenv/config';
import {getDumpFilesPaths} from '../helpers';
import path from 'path';
import {Query, RestCommand} from '@directus/sdk';
import {MigrationClient} from '../migration-client';
import {readFileSync, writeFileSync} from 'fs';
import {diff} from 'deep-object-diff';
import {logger} from "../logger";

type DirectusId = number | string;
type DirectusBaseType = {
    id: DirectusId;
};
type NoId<T extends DirectusBaseType> = Omit<T, 'id'>;
type UpdateItem<T> = {
    sourceItem: T;
    targetItem: T;
    diffItem: Partial<T>;
};

/**
 * This class is responsible for merging the data from a dump to a target table.
 * It creates new data, updates existing data and deletes data that is not present in the dump.
 */
export abstract class DirectusCollection<
    DirectusType extends DirectusBaseType,
> {
    protected readonly dumpPath: string;
    protected readonly filePath: string;

    protected readonly fieldsToIgnore: (keyof DirectusType)[] = ['id'];

    protected abstract readonly enableCreate: boolean;
    protected abstract readonly enableUpdate: boolean;
    protected abstract readonly enableDelete: boolean;

    constructor(protected readonly name: string) {
        this.dumpPath = getDumpFilesPaths().directusDumpPath;
        this.filePath = path.join(this.dumpPath, `${this.name}.json`);
    }

    /**
     * Dump data from a table to a JSON file
     */
    async dump() {
        const directus = await MigrationClient.get();
        const items = await directus.request(this.getQueryCommand({}));
        writeFileSync(this.filePath, JSON.stringify(items, null, 2));
        this.debug(`Dumped ${items.length} items.`);
    }

    async plan() {
        // Get the diff between the dump and the target table and log it
        const {toCreate, toUpdate, toDelete, unchanged} = await this.getDiff();

        this.info(`To create: ${toCreate.length} item(s)`);
        for (const item of toCreate) {
            this.debug(`Will create item`, item);
        }

        this.info(`To update: ${toUpdate.length} item(s)`);
        for (const {targetItem, diffItem} of toUpdate) {
            this.debug(`Will update item (id: ${targetItem.id})`, diffItem);
        }

        this.info(`To delete: ${toDelete.length} item(s)`);
        for (const item of toDelete) {
            this.debug(`Will delete item (id: ${item.id})`, item);
        }

        this.info(`Unchanged: ${unchanged.length} item(s)`);
        for (const item of unchanged) {
            this.debug(`Item ${item.id} is unchanged`);
        }
    }

    /**
     * Merge the data from the dump to the target table
     */
    async restore() {
        const {toCreate, toUpdate, toDelete} = await this.getDiff();
        if (this.enableCreate) {
            await this.create(toCreate);
        }
        if (this.enableUpdate) {
            await this.update(toUpdate);
        }
        if (this.enableDelete) {
            await this.delete(toDelete);
        }
    }

    protected debug(message: string, object?: object) {
        if (object) {
            logger.debug(`[${this.name}] ${message}`, object);
        } else {
            logger.debug(`[${this.name}] ${message}`);
        }
    }

    protected info(message: string) {
        logger.info(`[${this.name}] ${message}`);
    }

    protected abstract getQueryCommand(
        query: Query<DirectusType, object>,
    ): RestCommand<DirectusType[], object>;

    /**
     * Returns a command that allow to match items between source and target data.
     * This should not use the id field, as it may change between the dump and the target table.
     */
    protected abstract getMatchingItemCommand(
        item: DirectusType,
    ): RestCommand<DirectusType[], object>;

    protected abstract getInsertCommand(
        item: NoId<DirectusType>,
    ): RestCommand<DirectusType, object>;

    protected abstract getUpdateCommand(
        sourceItem: DirectusType,
        targetItem: DirectusType,
        diffItem: Partial<DirectusType>,
    ): RestCommand<DirectusType, object>;

    protected abstract getDeleteCommand(
        item: DirectusType,
    ): RestCommand<DirectusType, object>;

    protected abstract getDataMapper(): (data: DirectusType) => DirectusType;

    /**
     * Returns the source data from the dump file, using readFileSync
     * and passes it through the data transformer.
     * @protected
     */
    protected getSourceData(): DirectusType[] {
        const mapper = this.getDataMapper();
        const data = JSON.parse(
            String(readFileSync(this.filePath)),
        ) as DirectusType[];
        return data.map(mapper);
    }

    /**
     * Returns the diff between the dump and the target table.
     */
    protected async getDiff() {
        const sourceData = this.getSourceData();
        const directus = await MigrationClient.get();

        const toCreate: NoId<DirectusType>[] = [];
        const toUpdate: UpdateItem<DirectusType>[] = [];
        const unchanged: DirectusType[] = [];

        for (const sourceItem of sourceData) {
            // Take only the first item
            const [targetItem] = await directus.request(
                this.getMatchingItemCommand(sourceItem),
            );
            if (targetItem) {
                const {hasDiff, diffObject} = await this.getDiffBetweenItems(
                    sourceItem,
                    targetItem,
                );
                if (hasDiff) {
                    toUpdate.push({sourceItem, targetItem, diffItem: diffObject});
                } else {
                    unchanged.push(targetItem);
                }
            } else {
                // Omit the id field
                const {id, ...item} = sourceItem;
                toCreate.push(item);
            }
        }

        // All data that are not in toUpdate or unchanged should be in toDelete
        const toUpdateIds = toUpdate.map(({targetItem}) => targetItem.id);
        const unchangedIds = unchanged.map(({id}) => id);
        const toKeepIds = [...toUpdateIds, ...unchangedIds];

        const toDelete: DirectusType[] = toKeepIds.length
            ? await directus.request(
                this.getQueryCommand({filter: {id: {_nin: toKeepIds}}}),
            )
            : await directus.request(this.getQueryCommand({}));

        return {toCreate, toUpdate, toDelete, unchanged};
    }

    /**
     * Get the diff between two items and returns the source item with only the diff fields.
     * This is non-destructive, and non-deep.
     */
    protected async getDiffBetweenItems(
        sourceItem: DirectusType,
        targetItem: DirectusType,
    ) {
        const diffObject = diff(targetItem, sourceItem) as Partial<DirectusType>;
        for (const field of this.fieldsToIgnore) {
            delete diffObject[field];
        }
        const diffFields = Object.keys(diffObject) as (keyof DirectusType)[];

        // Compute diff object from source item to avoid transforming the source fields
        const sourceDiffObject = {} as Partial<DirectusType>;
        for (const field of diffFields) {
            sourceDiffObject[field] = sourceItem[field];
        }

        return {
            diffObject: sourceDiffObject,
            diffFields,
            hasDiff: diffFields.length > 0,
        };
    }

    protected async create(toCreate: NoId<DirectusType>[]) {
        const directus = await MigrationClient.get();
        for (const sourceItem of toCreate) {
            await directus.request(this.getInsertCommand(sourceItem));
            this.debug(`Created item`, sourceItem);
        }
        this.info(`Created ${toCreate.length} items`);
    }

    protected async update(toUpdate: UpdateItem<DirectusType>[]) {
        const directus = await MigrationClient.get();
        for (const {sourceItem, targetItem, diffItem} of toUpdate) {
            await directus.request(
                this.getUpdateCommand(sourceItem, targetItem, diffItem),
            );
            this.debug(`Updated ${targetItem.id}`, diffItem);
        }
        this.info(`Updated ${toUpdate.length} items`);
    }

    protected async delete(toDelete: DirectusType[]) {
        const directus = await MigrationClient.get();
        for (const targetItem of toDelete) {
            await directus.request(this.getDeleteCommand(targetItem));
            this.debug(`Deleted ${targetItem.id}`, targetItem);
        }
        this.info(`Deleted ${toDelete.length} items`);
    }
}
