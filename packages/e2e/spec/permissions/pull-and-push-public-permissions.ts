import {
  Context,
  getDumpedSystemCollectionsContents,
  newPermission,
  readNonSystemPermissions,
} from '../helpers/index.js';

export const pullAndPushPublicPermissions = (context: Context) => {
  it('should pull permissions with null role', async () => {
    // Init sync client
    const sync = await context.getSync('temp/pull-and-push-public-permissions');
    const directus = context.getDirectus();
    const client = directus.get();

    // Create permissions
    const delete1 = await newPermission(client, null, 'panels', 'delete');
    const create1 = await newPermission(client, null, 'panels', 'read');

    // Dump the data
    await sync.pull();
    const { permissions } = getDumpedSystemCollectionsContents(
      sync.getDumpPath(),
    );

    expect(permissions).toContain({
      _syncId: (await directus.getByLocalId('permissions', delete1.id)).sync_id,
      role: null,
      collection: delete1.collection,
      action: delete1.action,
      permissions: delete1.permissions,
      validation: delete1.validation,
      presets: delete1.presets,
      fields: delete1.fields,
    });
    expect(permissions).toContain({
      _syncId: (await directus.getByLocalId('permissions', create1.id)).sync_id,
      role: null,
      collection: create1.collection,
      action: create1.action,
      permissions: create1.permissions,
      validation: create1.validation,
      presets: create1.presets,
      fields: create1.fields,
    });
  });

  it('should push permissions with null role', async () => {
    // Init sync client
    const sync = await context.getSync('sources/public-permissions', false);
    const directus = context.getDirectus();
    const client = directus.get();

    // Push the data
    await sync.push();
    const permissions = await readNonSystemPermissions(client);

    expect(permissions.length).toEqual(2);
    for (const permission of permissions) {
      expect(permission.id).toBeDefined();
      expect(permission.role).toEqual(null);
      expect(permission.collection).toBeDefined();
      expect(permission.action).toBeDefined();
    }
  });
};
