import type { z } from 'zod';
import type {
  ClientConfigSchema,
  CollectionEnum,
  CollectionPreservableIdEnum,
  ConfigFileOptionsSchema,
  OptionsFields,
  OptionsSchema,
  RestConfigSchema,
} from './schema';
import type { MigrationClient } from '../migration-client';
import type { DirectusBaseType, Query } from '../collections';
import type { Snapshot } from '../snapshot';

export type OptionName = keyof typeof OptionsFields;

export type Options = z.infer<typeof OptionsSchema>;

export type ConfigFileOptions = z.infer<typeof ConfigFileOptionsSchema>;

export type CollectionName = z.infer<typeof CollectionEnum>;

export type CollectionPreservableIdName = z.infer<
  typeof CollectionPreservableIdEnum
>;

export type CollectionRecord<T> = Record<CollectionName, T>;

export type TransformDataFunction = <T = unknown>(
  data: T[],
  directusClient: Awaited<ReturnType<typeof MigrationClient.prototype.get>>,
) => T[] | Promise<T[]>;

export type TransformQueryFunction = <T = Query<DirectusBaseType>>(
  query: T,
  directusClient: Awaited<ReturnType<typeof MigrationClient.prototype.get>>,
) => T | Promise<T>;

export type TransformSnapshotFunction = (
  snapshot: Snapshot,
  directusClient: Awaited<ReturnType<typeof MigrationClient.prototype.get>>,
) => Snapshot | Promise<Snapshot>;

export interface CollectionHooks {
  onLoad?: TransformDataFunction;
  onDump?: TransformDataFunction;
  onSave?: TransformDataFunction;
  onQuery?: TransformQueryFunction;
}

export interface SnapshotHooks {
  onLoad?: TransformSnapshotFunction;
  onSave?: TransformSnapshotFunction;
}

export interface DirectusConfigBase {
  url: string;
  clientConfig: z.infer<typeof ClientConfigSchema> | undefined;
  restConfig: z.infer<typeof RestConfigSchema> | undefined;
}
export interface DirectusConfigWithToken extends DirectusConfigBase {
  token: string;
}
export interface DirectusConfigWithCredentials extends DirectusConfigBase {
  email: string;
  password: string;
}
