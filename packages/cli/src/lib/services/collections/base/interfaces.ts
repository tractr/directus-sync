import { IdMapperClient } from './id-mapper-client';
import { Query as DirectusQuery, RestCommand } from '@directus/sdk';
import { CollectionHooks } from '../../config';

export type DirectusId = number | string;

export interface DirectusRequestError {
  errors: {
    message: string;
    extensions: {
      collection?: string;
      field?: string;
      code: string;
    };
  }[];
  response: unknown;
}
export interface DirectusError {
  message: string;
  collection?: string;
  field?: string;
  code: string;
}

export interface DirectusBaseType {
  id: DirectusId;
}

export interface DirectusUnknownType {
  [key: string]: unknown;
}

export type WithSyncId<T> = T & {
  _syncId: string;
};
export type WithoutId<T> = Omit<T, 'id'>;
export type WithoutSyncId<T> = Omit<T, '_syncId'>;
export type WithoutIdAndSyncId<T> = Omit<T, 'id' | '_syncId'>;
export type WithSyncIdAndWithoutId<T> = WithSyncId<WithoutId<T>>;

export interface UpdateItem<T> {
  sourceItem: WithSyncIdAndWithoutId<T>;
  targetItem: WithSyncId<T>;
  diffItem: Partial<WithoutIdAndSyncId<T>>;
}

export type StrictField<T> = keyof WithSyncIdAndWithoutId<T>;
export type Field<T, Virtual extends string = never> =
  | keyof WithSyncIdAndWithoutId<T>
  | Virtual; // Allows other fields
export type IdMappers<T, Virtual extends string = never> = {
  [key in keyof T]?: IdMapperClient | IdMappers<T[key]>;
} & {
  [key in Virtual]?: IdMapperClient;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type BaseSchema = any;
export type Query<T extends DirectusBaseType | DirectusUnknownType> = DirectusQuery<BaseSchema, T>;
export type Command<T> = RestCommand<T, BaseSchema>; // Shortcode for RestCommand
export type SingleRestCommand<T> = Command<T> | Promise<Command<T>>;

export type MultipleRestCommand<T> =
  | Command<T>
  | [...Command<object>[], Command<T>]
  | Promise<Command<T> | [...Command<object>[], Command<T>]>;

export interface DirectusCollectionExtraConfig {
  hooks: CollectionHooks;
  preserveIds?: boolean;
}
