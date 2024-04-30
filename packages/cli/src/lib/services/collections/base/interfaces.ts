import { IdMapperClient } from './id-mapper-client';
import { Query as DirectusQuery, RestCommand } from '@directus/sdk';

export type DirectusId = number | string;

export interface DirectusBaseType {
  id: DirectusId;
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
export type IdMappers<T> = {
  [key in keyof T]?: IdMapperClient | IdMappers<T[key]>;
};

export type BaseSchema = object;
export type Query<T extends DirectusBaseType> = DirectusQuery<BaseSchema, T>;

export type Command<T> = RestCommand<T, object>; // Shortcode for RestCommand
export type SingleRestCommand<T> = Command<T> | Promise<Command<T>>;

export type MultipleRestCommand<T> =
  | Command<T>
  | [...Command<object>[], Command<T>]
  | Promise<Command<T>>
  | Promise<[...Command<object>[], Command<T>]>;
