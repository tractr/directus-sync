import {
  DirectusUser,
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
} from '@directus/sdk';
import { DirectusSchema, DirectusUnknownType } from '../interfaces';
import { DIRECTUS_COLLECTIONS_PREFIX } from '../../constants';
import { DirectusId } from '../collections';

type S = DirectusSchema;
type C = RegularCollections<S>;
type Q = Query<S, C>;
type AnyQuery = any;
type AnyItem = DirectusUnknownType | DirectusUser;

function isDirectusCollection(collection: string): boolean {
  return collection.startsWith(DIRECTUS_COLLECTIONS_PREFIX);
}

export function readMany(collection: string, query: AnyQuery) {
  if (!isDirectusCollection(collection)) {
    return readItems<S, C, Q>(collection, query as Query<S, C>);
  }

  if (collection === 'directus_users') {
    return readUsers(query as Query<S, DirectusUser>);
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
  }

  throw new Error(
    `Unsupported collection: ${collection}. Check the "directus-sync push" command instead.`,
  );
}
