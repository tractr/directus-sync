import type { z } from 'zod';
import type {
  ConfigFileOptionsSchema,
  OptionsFields,
  OptionsHooksSchema,
  OptionsSchema,
} from './schema';
import type { MigrationClient } from '../migration-client';
import type { DirectusBaseType, Query } from '../collections';

export type OptionName = keyof typeof OptionsFields;

export type Options = z.infer<typeof OptionsSchema>;

export type ConfigFileOptions = z.infer<typeof ConfigFileOptionsSchema>;

export type HookCollectionName = keyof typeof OptionsHooksSchema.shape;

export type TransformDataFunction = <T = unknown>(
  data: T[],
  directusClient: Awaited<ReturnType<typeof MigrationClient.prototype.get>>,
) => T[] | Promise<T[]>;

export type TransformQueryFunction = <T = Query<DirectusBaseType>>(
  query: T,
  directusClient: Awaited<ReturnType<typeof MigrationClient.prototype.get>>,
) => T | Promise<T>;

export interface Hooks {
  onLoad?: TransformDataFunction;
  onDump?: TransformDataFunction;
  onSave?: TransformDataFunction;
  onQuery?: TransformQueryFunction;
}

interface DirectusConfigBase {
  url: string;
}
export interface DirectusConfigWithToken extends DirectusConfigBase {
  token: string;
}
export interface DirectusConfigWithCredentials extends DirectusConfigBase {
  email: string;
  password: string;
}
