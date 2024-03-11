import { Inject, Service } from 'typedi';
import { MigrationClient } from '../migration-client';
import {
  OpenApiSpecOutput,
  readGraphqlSdl,
  readOpenApiSpec,
} from '@directus/sdk';
import path from 'path';
import { mkdirpSync, removeSync, writeJsonSync } from 'fs-extra';
import { LOGGER } from '../../constants';
import pino from 'pino';
import { getChildLogger } from '../../helpers';
import { ConfigService } from '../config';
import { writeFileSync } from 'node:fs';

const GRAPHQL_FILENAME = 'schema.graphql';
const SYSTEM_GRAPHQL_FILENAME = 'system.graphql';
const OPENAPI_FILENAME = 'openapi.json';

@Service()
export class SpecificationsClient {
  protected readonly dumpPath: string;

  protected readonly enabled: boolean;

  protected readonly logger: pino.Logger;

  constructor(
    config: ConfigService,
    @Inject(LOGGER) baseLogger: pino.Logger,
    protected readonly migrationClient: MigrationClient,
  ) {
    this.logger = getChildLogger(baseLogger, 'snapshot');
    const { dumpPath, enabled } = config.getSpecificationsConfig();
    this.dumpPath = dumpPath;
    this.enabled = enabled;
  }

  /**
   * Save the snapshot locally
   */
  async pull() {
    if (!this.enabled) {
      return;
    }

    const graphql = await this.getGraphQL('item');
    this.saveGraphQLData(graphql, GRAPHQL_FILENAME);
    this.logger.debug(`Saved GraphQL schema to ${this.dumpPath}`);

    const systemGraphql = await this.getGraphQL('system');
    this.saveGraphQLData(systemGraphql, SYSTEM_GRAPHQL_FILENAME);
    this.logger.debug(`Saved System GraphQL schema to ${this.dumpPath}`);

    const openapi = await this.getOpenAPI();
    this.saveOpenAPIData(openapi);
    this.logger.debug(`Saved OpenAPI specification to ${this.dumpPath}`);
  }

  /**
   * Get GraphQL SDL from the server
   */
  protected async getGraphQL(scope?: 'item' | 'system') {
    const directus = await this.migrationClient.get();
    const response = await directus.request<Response>(readGraphqlSdl(scope));
    return await response.text();
  }

  /**
   * Get OpenAPI specifications from the server
   */
  protected async getOpenAPI() {
    const directus = await this.migrationClient.get();
    return await directus.request(readOpenApiSpec());
  }

  /**
   * Save the GraphQL data to the dump file.
   */
  protected saveGraphQLData(data: string, filename: string): void {
    mkdirpSync(this.dumpPath);
    const filePath = path.join(this.dumpPath, filename);
    removeSync(filePath);
    writeFileSync(filePath, data);
  }

  /**
   * Save the OpenAPI JSON data to the dump file.
   */
  protected saveOpenAPIData(data: OpenApiSpecOutput): void {
    mkdirpSync(this.dumpPath);
    const filePath = path.join(this.dumpPath, OPENAPI_FILENAME);
    removeSync(filePath);
    writeJsonSync(filePath, data, { spaces: 2 });
  }
}
