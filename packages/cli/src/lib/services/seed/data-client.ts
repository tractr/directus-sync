import { DirectusId, Query } from '../collections';
import { DirectusUnknownType } from '../interfaces';
import { MigrationClient } from '../migration-client';
import pino from 'pino';
import { getChildLogger } from '../../helpers';
import { Inject, Service } from 'typedi';
import { COLLECTION, LOGGER } from '../../constants';
import { SnapshotClient, Type } from '../snapshot';
import deepmerge from 'deepmerge';
import { createOne, deleteOne, readMany, updateOne } from './requests';

@Service()
export class SeedDataClient {
  protected readonly logger: pino.Logger;

  constructor(
    @Inject(LOGGER) protected readonly baseLogger: pino.Logger,
    protected readonly migrationClient: MigrationClient,
    protected readonly snapshotClient: SnapshotClient,
    @Inject(COLLECTION) protected readonly collection: string,
  ) {
    this.logger = getChildLogger(baseLogger, collection);
  }

  /**
   * Request data from the collection
   */
  async query<T extends DirectusUnknownType>(query: Query<T>): Promise<T[]> {
    const directus = await this.migrationClient.get();
    const response = await directus.request<T | T[]>(
      readMany(this.collection, query),
    );

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
    const primaryField = await this.snapshotClient.getPrimaryField(
      this.collection,
    );
    const isNumber = primaryField.type === Type.Integer;
    const isArray = Array.isArray(values);
    const castedValues = isNumber
      ? isArray
        ? values.map(Number)
        : Number(values)
      : values;

    const filter: Query<T> = Array.isArray(castedValues)
      ? { filter: { [primaryField.name]: { _in: castedValues } } }
      : { filter: { [primaryField.name]: { _eq: castedValues } } };

    return await this.query<T>(deepmerge(filter, query));
  }

  /**
   * Create a new item in the collection
   */
  async create<T extends DirectusUnknownType>(data: Partial<T>): Promise<T> {
    const directus = await this.migrationClient.get();
    return await directus.request<T>(createOne(this.collection, data));
  }

  /**
   * Update an item in the collection
   */
  async update<T extends DirectusUnknownType>(
    key: DirectusId,
    data: Partial<T>,
  ): Promise<T> {
    const directus = await this.migrationClient.get();
    return await directus.request<T>(updateOne(this.collection, key, data));
  }

  /**
   * Delete an item from the collection
   */
  async delete<T extends DirectusUnknownType>(key: DirectusId): Promise<void> {
    const directus = await this.migrationClient.get();
    await directus.request<T>(deleteOne(this.collection, key));
  }
}
