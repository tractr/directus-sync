import {
  DirectusUser,
  DirectusFile,
  readItems,
  readUsers,
  RegularCollections,
  Query,
  createItem,
  createUser,
  updateItem,
  updateUser,
  deleteItem,
  deleteUser,
  readFiles,
  uploadFiles,
  updateFile,
  deleteFile,
} from '@directus/sdk';
import { DirectusSchema, DirectusUnknownType } from '../../interfaces';
import { DIRECTUS_COLLECTIONS_PREFIX } from '../constants';
import { DirectusId } from '../../collections';

type S = DirectusSchema;
type C = RegularCollections<S>;
type Q = Query<S, C>;

// TODO: Improve directus query type
/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyQuery = any;
type AnyItem = DirectusUnknownType | DirectusUser | DirectusFile;

function isDirectusCollection(collection: string): boolean {
  return collection.startsWith(DIRECTUS_COLLECTIONS_PREFIX);
}

export function readMany(collection: string, query: AnyQuery) {
  if (!isDirectusCollection(collection)) {
    return readItems<S, C, Q>(collection, query as Query<S, C>);
  }

  if (collection === 'directus_users') {
    return readUsers(query as Query<S, DirectusUser>);
  } else if (collection === 'directus_files') {
    return readFiles(query as Query<S, DirectusFile>);
  }

  throw new Error(
    `Unsupported collection: ${collection}. Check the "directus-sync push" command instead.`,
  );
}

export function createOne(collection: string, item: AnyItem) {
  if (!isDirectusCollection(collection)) {
    return createItem<S, C, Q>(collection, item);
  }

  if (collection === 'directus_users') {
    return createUser(item);
  } else if (collection === 'directus_files') {
    const formData = objectToFormData(item);
    return uploadFiles(formData);
  }

  throw new Error(
    `Unsupported collection: ${collection}. Check the "directus-sync push" command instead.`,
  );
}

export function updateOne(
  collection: string,
  id: DirectusId,
  item: Partial<AnyItem>,
) {
  if (!isDirectusCollection(collection)) {
    return updateItem<S, C, Q>(collection, id, item);
  }

  if (collection === 'directus_users') {
    return updateUser(id as string, item as Partial<DirectusUser>);
  } else if (collection === 'directus_files') {
    return updateFile(id as string, item as Partial<DirectusFile>);
  }

  throw new Error(
    `Unsupported collection: ${collection}. Check the "directus-sync push" command instead.`,
  );
}

export function deleteOne(collection: string, id: DirectusId) {
  if (!isDirectusCollection(collection)) {
    return deleteItem<S, C>(collection, id);
  }

  if (collection === 'directus_users') {
    return deleteUser(id as string);
  } else if (collection === 'directus_files') {
    return deleteFile(id as string);
  }

  throw new Error(
    `Unsupported collection: ${collection}. Check the "directus-sync push" command instead.`,
  );
}

export function objectToFormData(object: AnyItem) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(object)) {
    formData.append(key, value as string | Blob);
  }
  return formData;
}
