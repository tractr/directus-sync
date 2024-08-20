import { DirectusPolicy as BaseDirectusPolicy } from '@directus/sdk';

// TODO: remove this once it is fixed in the SDK
export type DirectusPolicy<T> = BaseDirectusPolicy<T> & {
  name: string;
};
