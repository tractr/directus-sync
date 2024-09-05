import {
  Context,
  getDumpedSystemCollectionsContents,
  newPermission,
  newPolicy,
  readNonSystemPermissions,
} from '../helpers/index.js';

export const pullAndPushPublicPermissions = (context: Context) => {
  it('should pull permissions with public policy', async () => {
    // Init sync client
    const sync = await context.getSync('temp/pull-and-push-public-permissions');
    const directus = context.getDirectus();
    const client = directus.get();

    // Create permissions
    const publicPolicy = await newPolicy(client, null);
    const delete1 = await newPermission(
      client,
      publicPolicy.id,
      'panels',
      'delete',
    );
    const read1 = await newPermission(
      client,
      publicPolicy.id,
      'panels',
      'read',
    );

    // Dump the data
    await sync.pull();
    const { permissions } = getDumpedSystemCollectionsContents(
      sync.getDumpPath(),
    );

    expect(permissions).toContain({
      _syncId: (await directus.getByLocalId('permissions', delete1.id)).sync_id,
      policy: (await directus.getByLocalId('policies', publicPolicy.id))
        .sync_id,
      collection: delete1.collection,
      action: delete1.action,
      permissions: delete1.permissions,
      validation: delete1.validation,
      presets: delete1.presets,
      fields: delete1.fields,
    });
    expect(permissions).toContain({
      _syncId: (await directus.getByLocalId('permissions', read1.id)).sync_id,
      policy: (await directus.getByLocalId('policies', publicPolicy.id))
        .sync_id,
      collection: read1.collection,
      action: read1.action,
      permissions: read1.permissions,
      validation: read1.validation,
      presets: read1.presets,
      fields: read1.fields,
    });
  });

  it('should push permissions with public policy', async () => {
    // Init sync client
    const sync = await context.getSync('sources/public-permissions');
    const directus = context.getDirectus();
    const client = directus.get();

    // Push the data
    await sync.push();
    const permissions = await readNonSystemPermissions(client);

    expect(permissions.length).toEqual(2);
    for (const permission of permissions) {
      expect(permission.id).toBeDefined();
      expect(permission.policy).toBeDefined();
      expect(permission.collection).toBeDefined();
      expect(permission.action).toBeDefined();
    }
  });
};
