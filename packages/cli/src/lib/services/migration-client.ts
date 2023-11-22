import {
  authentication,
  AuthenticationClient,
  createDirectus,
  DirectusClient,
  readMe,
  rest,
  RestClient,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { LOGGER } from '../constants';
import { ConfigService } from './config';

@Service()
export class MigrationClient {
  protected adminRoleId: string | undefined;

  protected readonly client: DirectusClient<object> &
    RestClient<object> &
    AuthenticationClient<object>;

  constructor(
    protected readonly config: ConfigService,
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
      const { role } = await directus.request(
        readMe({
          fields: ['role'],
        }),
      );
      this.adminRoleId = role as string;
    }
    return this.adminRoleId;
  }

  protected createClient() {
    const { url, token } = this.config.getDirectusConfig();
    const client = createDirectus(url).with(rest()).with(authentication());
    client.setToken(token);
    return client;
  }
}
