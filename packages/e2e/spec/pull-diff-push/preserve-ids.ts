import {
  Context,
  getDumpedSystemCollectionsContents,
  createOneItemInEachSystemCollection,
  SingularCollectionName,
  readAllSystemCollections,
} from '../helpers/index.js';
import { CollectionName } from 'directus-sync';

interface CollectionInfo {
  singular: SingularCollectionName;
  collection: CollectionName;
  preserve: 'optional' | 'always' | 'never';
}
const collectionsInfo: CollectionInfo[] = [
  { singular: 'dashboard', collection: 'dashboards', preserve: 'optional' },
  { singular: 'flow', collection: 'flows', preserve: 'always' },
  { singular: 'folder', collection: 'folders', preserve: 'always' },
  { singular: 'operation', collection: 'operations', preserve: 'optional' },
  { singular: 'panel', collection: 'panels', preserve: 'optional' },
  { singular: 'permission', collection: 'permissions', preserve: 'never' },
  { singular: 'preset', collection: 'presets', preserve: 'never' },
  { singular: 'role', collection: 'roles', preserve: 'optional' },
  { singular: 'settings', collection: 'settings', preserve: 'never' },
  { singular: 'translation', collection: 'translations', preserve: 'optional' },
];

const collectionsWithOption = collectionsInfo
  .filter((info) => info.preserve === 'optional')
  .map((info) => info.collection);

const options = [null, ...collectionsWithOption, 'all'];

const getSyncId = (items: { _syncId: string }[]): string => {
  return items[0] ? items[0]._syncId : 'no items';
};
const getFirstId = (
  items: { id: string | number }[],
): string | number | undefined => {
  return items[0] ? items[0].id : undefined;
};

export const preserveIds = (context: Context) => {
  for (const option of options) {
    it(`should preserve uuid on pull if required with "${option}"`, async () => {
      // Init sync client
      const sync = await context.getSync('temp/preserve-ids');
      const dumpPath = sync.getDumpPath();

      // --------------------------------------------------------------------
      // Create content using Directus SDK
      const client = context.getDirectus().get();
      const original = await createOneItemInEachSystemCollection(client);

      // --------------------------------------------------------------------
      // Pull the content from Directus
      await sync.pull(option ? ['--preserve-ids', option] : []);

      // --------------------------------------------------------------------
      // Should preserve the ids for folders and flows but not for the rest
      const collections = getDumpedSystemCollectionsContents(dumpPath);

      for (const info of collectionsInfo) {
        const { singular, collection, preserve } = info;
        const remoteId = original[singular].id.toString();
        const syncId = getSyncId(collections[collection]);

        if (preserve === 'always') {
          expect(remoteId).toBe(syncId);
        } else if (preserve === 'never') {
          expect(remoteId).not.toBe(syncId);
        } else if (preserve === 'optional') {
          if (option === collection || option === 'all') {
            expect(remoteId).toBe(syncId);
          } else {
            expect(remoteId).not.toBe(syncId);
          }
        }
      }
    });

    it(`should preserve uuid on push if required with "${option}"`, async () => {
      // Init sync client
      const sync = await context.getSync(
        'sources/one-item-per-collection',
        false,
      );

      // --------------------------------------------------------------------
      // Get collections info from the dump
      const dumpPath = sync.getDumpPath();
      const original = getDumpedSystemCollectionsContents(dumpPath);

      // --------------------------------------------------------------------
      // Push the content to Directus
      await sync.push(option ? ['--preserve-ids', option] : []);

      // --------------------------------------------------------------------
      // Get content using Directus SDK
      const client = context.getDirectus().get();
      const collections = await readAllSystemCollections(client);

      for (const info of collectionsInfo) {
        const { collection, preserve } = info;
        const syncId = getSyncId(original[collection]);
        const remoteId = getFirstId(collections[collection])?.toString();
        if (!remoteId) {
          throw new Error(`No items in collection: ${collection}`);
        }

        if (preserve === 'always') {
          expect(syncId).toBe(remoteId);
        } else if (preserve === 'never') {
          expect(syncId).not.toBe(remoteId);
        } else if (preserve === 'optional') {
          if (option === collection || option === 'all') {
            expect(syncId).toBe(remoteId);
          } else {
            expect(syncId).not.toBe(remoteId);
          }
        }
      }
    });
  }
};
