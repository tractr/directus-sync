import { DirectusId, Query, DirectusUnknownType } from '../collections';
import { MigrationClient } from '../migration-client';
import pino from 'pino';
import { getChildLogger } from '../../helpers';
import { Container } from 'typedi';
import { LOGGER } from '../../constants';
import { SnapshotClient } from '../snapshot';
import { createItem, deleteItem, readItems, updateItem } from '@directus/sdk';

export class SeedDataClient {
  protected readonly logger: pino.Logger;
  protected readonly migrationClient: MigrationClient;
  protected readonly snapshotClient: SnapshotClient;
  
  constructor(
    protected readonly collection: string,
  ) {
    // Get base logger
    const baseLogger = Container.get<pino.Logger>(LOGGER);
    this.logger = getChildLogger(baseLogger, `Collection:${collection}`);

    // Get migration client
    this.migrationClient = Container.get('MigrationClient');

    // Get snapshot client
    this.snapshotClient = Container.get(SnapshotClient);
  }

  /**
   * Request data from the collection
   */
  async query<T extends DirectusUnknownType>(query: Query<T>): Promise<T[]> {
    const directus = await this.migrationClient.get();
    const response = await directus.request<T | T[]>(readItems(this.collection, query));

    if (Array.isArray(response)) {
      return response;
    }

    // Some collections return a single object instead of an array
    if (!response || typeof response !== 'object') {
      return [];
    }

    return [response as T];
  }

  /**
   * Query by primary field (one or multiple values)
   */
  async queryByPrimaryField<T extends DirectusUnknownType>(
    values: string | string[],
    query: Query<T> = {},
  ): Promise<T[]> {
    const primaryField = await this.snapshotClient.getPrimaryField(this.collection);
    if (Array.isArray(values)) {
      return await this.query<T>({ [primaryField.name]: { _in: values }, ...query });
    }
    return await this.query<T>({ [primaryField.name]: { _eq: values }, ...query });
  }

  /**
   * Create a new item in the collection
   */
  async create<T extends DirectusUnknownType>(data: Partial<T>): Promise<T> {
    const directus = await this.migrationClient.get();
    return await directus.request<T>(createItem(this.collection, data));
  }

  /**
   * Update an item in the collection
   */
  async update<T extends DirectusUnknownType>(
    key: DirectusId,
    data: Partial<T>,
  ): Promise<T> {
    const directus = await this.migrationClient.get();
    return await directus.request<T>(updateItem(this.collection, key, data));
  }

  /**
   * Delete an item from the collection
   */
  async delete<T extends DirectusUnknownType>(key: DirectusId): Promise<void> {
    const directus = await this.migrationClient.get();
    await directus.request<T>(deleteItem(this.collection, key));
    }
} 
