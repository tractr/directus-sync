import {
  DirectusPolicy as GenericBaseDirectusPolicy,
  Query as DirectusQuery,
} from '@directus/sdk';

// TODO: remove this once it is fixed in the SDK
export type DirectusPolicy<T> = Omit<GenericBaseDirectusPolicy<T>, 'roles'> & {
  name: string;
  roles: {
    role: string;
    sort: number;
  }[];
};
export type BaseDirectusPolicy<T> = GenericBaseDirectusPolicy<T>;
export type BaseDirectusPolicyQuery<T> = DirectusQuery<
  T,
  BaseDirectusPolicy<T>
>;
