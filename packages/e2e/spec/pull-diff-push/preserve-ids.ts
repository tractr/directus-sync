import {
  Context,
  getDumpedSystemCollectionsContents,
  createOneItemInEachSystemCollection
} from '../helpers/index.js';

export const preserveIds = (context: Context) => {

  it('should preserve some uuid from Directus', async () => {
    // Init sync client
    const sync = await context.getSync('preserve-ids');
    const dumpPath = sync.getDumpPath();

    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = context.getDirectus().get();
    const original = await createOneItemInEachSystemCollection(client);

    // --------------------------------------------------------------------
    // Pull the content from Directus
    await sync.pull();

    // --------------------------------------------------------------------
    // Should preserve the ids for folders and flows but not for the rest
    const collections = getDumpedSystemCollectionsContents(dumpPath);
    const getSyncId = (items: { _syncId: string }[]): string => {
      return items[0] ? items[0]._syncId : 'no items';
    };

    expect(original.flow.id).toBe(getSyncId(collections.flows));
    expect(original.folder.id).toBe(getSyncId(collections.folders));

    expect(original.dashboard.id.toString()).not.toBe(
      getSyncId(collections.dashboards),
    );
    expect(original.operation.id.toString()).not.toBe(
      getSyncId(collections.operations),
    );
    expect(original.panel.id.toString()).not.toBe(
      getSyncId(collections.panels),
    );
    expect(original.role.id.toString()).not.toBe(getSyncId(collections.roles));
    expect(original.permission.id.toString()).not.toBe(
      getSyncId(collections.permissions),
    );
    expect(original.preset.id.toString()).not.toBe(
      getSyncId(collections.presets),
    );
    expect(original.translation.id.toString()).not.toBe(
      getSyncId(collections.translations),
    );
    expect(original.webhook.id.toString()).not.toBe(
      getSyncId(collections.webhooks),
    );
  });
}
