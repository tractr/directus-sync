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
  directus_files: {
    primaryField: { name: 'id', type: Type.UUID },
    relations: [
      {
        collection: 'directus_folders',
        field: 'folder',
      },
      {
        collection: 'directus_users',
        field: 'uploaded_by',
      },
    ],
    ignoreOnUpdate: ['_file_path'],
  },
} as const;

export type SupportedDirectusCollections = keyof typeof DirectusNativeStructure;

export const SupportedDirectusCollections = Object.keys(
  DirectusNativeStructure,
) as SupportedDirectusCollections[];
