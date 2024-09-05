import { DirectusPermission as GenericBaseDirectusPermission } from '@directus/sdk';
import { BaseSchema } from '../base';
import { DirectusPolicy } from '../policies';

// TODO: remove this once this PR has been merged: https://github.com/directus/directus/pull/23380
export type BaseDirectusPermission = GenericBaseDirectusPermission<BaseSchema>;
export type DirectusPermission = Omit<BaseDirectusPermission, 'role'> & {
  policy: DirectusPolicy | string;
};
