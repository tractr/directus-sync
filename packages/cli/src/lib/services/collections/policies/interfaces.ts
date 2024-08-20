import { DirectusPolicy as BaseDirectusPolicy } from '@directus/sdk';
import { BaseSchema } from '../base';

// TODO: remove this once it is fixed in the SDK
export type DirectusPolicy = BaseDirectusPolicy<BaseSchema> & {
  name: string;
};
