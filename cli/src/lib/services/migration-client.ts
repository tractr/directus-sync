import {
    authentication,
    AuthenticationClient,
    createDirectus,
    DirectusClient,
    readMe,
    rest,
    RestClient,
} from '@directus/sdk';
import {Inject, Service} from 'typedi';
import pino from 'pino';
import {DIRECTUS_CONFIG, LOGGER} from '../constants';
import type {DirectusConfig} from '../config';

@Service()
export class MigrationClient {

    protected adminRoleId: string | undefined;

    protected readonly client: DirectusClient<any> &
        RestClient<any> &
        AuthenticationClient<any>;

    constructor(
        @Inject(DIRECTUS_CONFIG) protected readonly config: DirectusConfig,
        @Inject(LOGGER) protected readonly logger: pino.Logger,
    ) {
        this.client = this.createClient();
    }

    get() {
        return this.client;
    }

    /**
     * This method return the role of the current user as the Admin role
     */
    async getAdminRoleId() {
        if (!this.adminRoleId) {
            const directus = this.get();
            const {role} = await directus.request(readMe({
                fields: ['role'],
            }));
            this.adminRoleId = role;
        }
        return this.adminRoleId;
    }

    protected createClient() {
        const client = createDirectus(this.config.url)
            .with(rest())
            .with(authentication());
        client.setToken(this.config.token);
        return client;
    }
}
