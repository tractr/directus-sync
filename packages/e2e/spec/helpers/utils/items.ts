import {
  DirectusClient,
  RestClient,
  readItems,
  readItem,
  createItem as createItemRequest,
  deleteItem as deleteItemRequest,
  updateItem as updateItemRequest,
} from '@directus/sdk';

// TODO: Improve directus schema type
/* eslint-disable @typescript-eslint/no-explicit-any */
type Schema = any;
/* eslint-disable @typescript-eslint/no-explicit-any */
type DefaultItem = Record<string, any>;

export async function getAllItems<T = DefaultItem>(
  client: DirectusClient<Schema> & RestClient<Schema>,
  collection: string,
) {
  return await client.request<T[]>(readItems(collection));
}

export async function getItem<T = DefaultItem>(
  client: DirectusClient<Schema> & RestClient<Schema>,
  collection: string,
  id: string,
) {
  return await client.request<T | undefined>(readItem(collection, id));
}

export async function createItem<T = DefaultItem>(
  client: DirectusClient<Schema> & RestClient<Schema>,
  collection: string,
  item: T,
) {
  return await client.request(
    createItemRequest(collection, item as Partial<DefaultItem>),
  );
}

export async function deleteItem(
  client: DirectusClient<Schema> & RestClient<Schema>,
  collection: string,
  id: string,
) {
  return await client.request(deleteItemRequest(collection, id));
}

export async function updateItem<T = DefaultItem>(
  client: DirectusClient<Schema> & RestClient<Schema>,
  collection: string,
  id: string,
  item: T,
) {
  return await client.request(
    updateItemRequest(collection, id, item as Partial<DefaultItem>),
  );
}
