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

    protected userRoleId: string | undefined;

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
     * This methods return the role of the current user
     */
    async getUserRoleId() {
        if (!this.userRoleId) {
            const directus = this.get();
            const {role} = await directus.request(readMe({
                fields: ['role'],
            }));
            this.userRoleId = role;
        }
        return this.userRoleId;
    }

    protected createClient() {
        const client = createDirectus(this.config.url)
            .with(rest())
            .with(authentication());
        client.setToken(this.config.token);
        return client;
    }
}
