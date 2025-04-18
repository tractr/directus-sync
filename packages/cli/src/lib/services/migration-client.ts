import {
  authentication,
  AuthenticationClient,
  clearCache,
  ClientOptions,
  createDirectus,
  DirectusClient,
  rest,
  RestClient,
  RestConfig,
  serverInfo,
} from '@directus/sdk';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { LOGGER } from '../constants';
import { ConfigService, isDirectusConfigWithToken } from './config';
import { getChildLogger } from '../helpers';
import { compareVersions } from 'compare-versions';
import { Cacheable } from 'typescript-cacheable';
import { DirectusSchema } from './interfaces';
@Service({ global: true })
export class MigrationClient {
  protected readonly logger: pino.Logger;

  protected adminRoleId: string | undefined;

  protected client:
    | (DirectusClient<DirectusSchema> &
        RestClient<DirectusSchema> &
        AuthenticationClient<DirectusSchema>)
    | undefined;

  constructor(
    protected readonly config: ConfigService,
    @Inject(LOGGER) baseLogger: pino.Logger,
  ) {
    this.logger = getChildLogger(baseLogger, 'migration-client');
  }

  async get() {
    if (!this.client) {
      this.client = await this.createClient();
    }
    return this.client;
  }

  /**
   * This method clears the cache of the Directus instance
   */
  async clearCache() {
    const directus = await this.get();
    await directus.request(clearCache());
    this.logger.debug('Cache cleared');
  }

  protected async createClient() {
    const config = this.config.getDirectusConfig();
    const client = createDirectus(
      config.url,
      config.clientConfig as ClientOptions | undefined,
    )
      .with(rest(config.restConfig as RestConfig | undefined))
      .with(authentication());

    // If the token is already set, return it
    let token: string;
    if (isDirectusConfigWithToken(config)) {
      token = config.token;
    }
    // Otherwise, login and return the token
    else {
      const response = await client.login(config.email, config.password);

      // Check if the token is defined
      if (!response.access_token) {
        throw new Error('Cannot login to Directus');
      }

      token = response.access_token;
    }

    await client.setToken(token);
    return client;
  }

  /**
   * Get the server version
   */
  @Cacheable()
  protected async getDirectusVersion() {
    const client = await this.get();
    const info = await client.request<{ version?: string }>(serverInfo());
    if (!info?.version) {
      throw new Error('Could not get the Directus version');
    }
    return info.version;
  }

  /**
   * This method compares the Directus instance version with the given one.
   */
  protected async compareWithDirectusVersion(
    version: string,
  ): Promise<'equal' | 'greater' | 'smaller'> {
    const directusVersion = await this.getDirectusVersion();
    const diff = compareVersions(version, directusVersion);
    if (diff === 0) {
      return 'equal';
    } else if (diff > 0) {
      return 'greater';
    } else {
      return 'smaller';
    }
  }

  /**
   * This method validate that the Directus instance version is compatible with the current CLI version.
   */
  async validateDirectusVersion() {
    const directusVersion = await this.getDirectusVersion();
    if ((await this.compareWithDirectusVersion('10.0.0')) === 'greater') {
      throw new Error(
        `This CLI is not compatible with Directus ${directusVersion}. Please upgrade Directus to 10.0.0 (or higher).`,
      );
    }
    if ((await this.compareWithDirectusVersion('11.0.0')) === 'greater') {
      throw new Error(
        `This CLI is not compatible with Directus ${directusVersion}. Please use \`npx directus-sync@2.2.0 [command]\` or upgrade Directus to 11.0.0 (or higher).`,
      );
    }
    this.logger.debug(`Directus ${directusVersion} is compatible`);
  }
}
