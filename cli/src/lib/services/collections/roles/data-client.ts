import {DataClient, WithoutIdAndSyncId} from '../base';
import {createRole, deleteRole, DirectusRole, Query, readRoles, updateRole,} from '@directus/sdk';
import {Service} from 'typedi';
import {MigrationClient} from '../../migration-client';
import deepmerge from "deepmerge";

@Service()
export class RolesDataClient extends DataClient<DirectusRole<object>> {
    constructor(migrationClient: MigrationClient) {
        super(migrationClient);
    }

    protected getDeleteCommand(itemId: string) {
        return deleteRole(itemId);
    }

    protected getInsertCommand(item: WithoutIdAndSyncId<DirectusRole<object>>) {
        return createRole(item);
    }

    protected async getQueryCommand(query: Query<DirectusRole<object>, object>) {
        // Always exclude the admin role from the dump
        const adminRoleId = await this.migrationClient.getUserRoleId();
        // Do not filter by id if the query already contains a filter for the id
        const hasIdFilter = query.filter && (query.filter as { id?: string }).id;
        const newQuery = !hasIdFilter ? deepmerge(query, {
            filter: {
                id: {
                    _neq: adminRoleId,
                }
            }
        }) as Query<DirectusRole<object>, object> : query;
        return readRoles(newQuery);
    }

    protected getUpdateCommand(
        itemId: string,
        diffItem: Partial<WithoutIdAndSyncId<DirectusRole<object>>>,
    ) {
        return updateRole(itemId, diffItem);
    }
}
