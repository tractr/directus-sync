import { DirectusPolicy as GenericBaseDirectusPolicy } from '@directus/sdk';
import { BaseSchema } from '../base';

// TODO: remove this once it is fixed in the SDK
export type BaseDirectusPolicy = GenericBaseDirectusPolicy<BaseSchema>;
export type DirectusPolicy = BaseDirectusPolicy & {
  name: string;
};
export interface DirectusPolicyAccess {
  id: number;
  policy: string;
  role?: string | null;
  user?: string | null;
  sort: number;
}
export interface PolicyRolesDiff {
  create: Partial<DirectusPolicyAccess>[];
  update: Partial<DirectusPolicyAccess>[];
  delete: number[];
}
