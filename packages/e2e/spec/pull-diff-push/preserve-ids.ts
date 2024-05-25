import {
  Context,
  getDumpedSystemCollectionsContents,
  createOneItemInEachSystemCollection,
  SingularCollectionName
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

const options = [
  null,
  ...collectionsWithOption,
  'all',
]

export const preserveIds = (context: Context) => {

  for (const option of options) {
    it(`should preserve uuid from Directus if required with "${option}"`, async () => {
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
      const getSyncId = (items: { _syncId: string }[]): string => {
        return items[0] ? items[0]._syncId : 'no items';
      };

      expect(original.flow.id).toBe(getSyncId(collections.flows));
      expect(original.folder.id).toBe(getSyncId(collections.folders));

      for (const info of collectionsInfo) {
        const { singular, collection, preserve } = info;
        const originalId = original[singular].id.toString();
        const syncId = getSyncId(collections[collection]);

        if (preserve === 'always') {
          expect(originalId).toBe(syncId);
        }
        else if (preserve === 'never') {
          expect(originalId).not.toBe(syncId);
        }
        else if (preserve === 'optional') {
          if (option === collection || option === 'all') {
            expect(originalId).toBe(syncId);
          } else {
            expect(originalId).not.toBe(syncId);
          }
        }
      }
    });
  }

};
