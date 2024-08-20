import {
  DirectusPermission as BaseDirectusPermission,
  DirectusPolicy as BaseDirectusPolicy,
} from '@directus/sdk';
import { BaseSchema } from '../base';

// TODO: remove this once this PR has been merged: https://github.com/directus/directus/pull/23380
export type DirectusPermission = Omit<
  BaseDirectusPermission<BaseSchema>,
  'role'
> & {
  policy: BaseDirectusPolicy<BaseSchema> | string;
};
export type { BaseDirectusPermission };
