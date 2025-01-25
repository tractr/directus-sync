import { Type } from '../../snapshot';

export const DirectusNativeStructure = {
  directus_users: {
    primaryField: { name: 'id', type: Type.UUID },
    relations: [
      {
        collection: 'directus_roles',
        field: 'role',
      },
    ],
    ignoreOnUpdate: ['password'],
  },
} as const;

export type SupportedDirectusCollections = keyof typeof DirectusNativeStructure;

export const SupportedDirectusCollections = Object.keys(
  DirectusNativeStructure,
) as SupportedDirectusCollections[];
