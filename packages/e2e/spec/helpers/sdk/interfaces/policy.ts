import { DirectusPolicy as GenericBaseDirectusPolicy } from '@directus/sdk';

// TODO: remove this once it is fixed in the SDK
export type DirectusPolicy<T> = Omit<GenericBaseDirectusPolicy<T>, 'roles'> & {
  name: string;
  roles: {
    role: string;
    sort: number;
  }[];
};
export type BaseDirectusPolicy<T> = GenericBaseDirectusPolicy<T>;
