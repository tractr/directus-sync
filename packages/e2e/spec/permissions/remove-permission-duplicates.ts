import {
  Context,
  info,
  newPermission,
  newPolicy,
  newRole,
  readNonSystemPermissions,
} from '../helpers/index.js';

export const removePermissionDuplicates = (context: Context) => {
  it('should remove permission duplicates and and keep the last one', async () => {
    // Init sync client
    const sync = await context.getSync('temp/remove-permission-duplicates');
    const directus = context.getDirectus();
    const client = directus.get();

    // Create permissions
    const role = await newRole(client);
    const policy = await newPolicy(client, role.id);
    const publicPolicy = await newPolicy(client, null);
    const update1 = await newPermission(client, policy.id, 'panels', 'update');
    const update2 = await newPermission(client, policy.id, 'panels', 'update');
    await newPermission(client, policy.id, 'panels', 'create');
    const delete1 = await newPermission(
      client,
      publicPolicy.id,
      'panels',
      'delete',
    );
    const delete2 = await newPermission(
      client,
      publicPolicy.id,
      'panels',
      'delete',
    );
    await newPermission(client, publicPolicy.id, 'panels', 'read');

    // Dump the data
    const output = await sync.removePermissionDuplicates('last');
    expect(output).toContain(
      info(
        `[helpers-client] Deleted 1 duplicated permissions for policy ${policy.id}, collection directus_panels, action update`,
      ),
    );
    expect(output).toContain(
      info(
        `[helpers-client] Deleted 1 duplicated permissions for policy null, collection directus_panels, action delete`,
      ),
    );

    // Able to read the permissions
    const permissions = await readNonSystemPermissions(client);

    expect(permissions.length).toEqual(4);
    for (const permission of permissions) {
      expect(permission.id).toBeDefined();
      expect(permission.policy).toBeDefined();
      expect(permission.collection).toBeDefined();
      expect(permission.action).toBeDefined();
    }

    expect(permissions.some((p) => p.id === update1.id)).toBeFalse();
    expect(permissions.some((p) => p.id === update2.id)).toBeTrue();
    expect(permissions.some((p) => p.id === delete1.id)).toBeFalse();
    expect(permissions.some((p) => p.id === delete2.id)).toBeTrue();
  });

  it('should remove permission duplicates and and keep the first one', async () => {
    // Init sync client
    const sync = await context.getSync('temp/remove-permission-duplicates');
    const directus = context.getDirectus();
    const client = directus.get();

    // Create permissions
    const role = await newRole(client);
    const policy = await newPolicy(client, role.id);
    const publicPolicy = await newPolicy(client, null);
    const update1 = await newPermission(client, policy.id, 'panels', 'update');
    const update2 = await newPermission(client, policy.id, 'panels', 'update');
    await newPermission(client, policy.id, 'panels', 'create');
    const delete1 = await newPermission(
      client,
      publicPolicy.id,
      'panels',
      'delete',
    );
    const delete2 = await newPermission(
      client,
      publicPolicy.id,
      'panels',
      'delete',
    );
    await newPermission(client, publicPolicy.id, 'panels', 'read');

    // Dump the data
    await sync.removePermissionDuplicates('first');

    // Able to read the permissions
    const permissions = await readNonSystemPermissions(client);

    expect(permissions.some((p) => p.id === update1.id)).toBeTrue();
    expect(permissions.some((p) => p.id === update2.id)).toBeFalse();
    expect(permissions.some((p) => p.id === delete1.id)).toBeTrue();
    expect(permissions.some((p) => p.id === delete2.id)).toBeFalse();
  });

  it('should not remove permissions if no duplicates', async () => {
    // Init sync client
    const sync = await context.getSync('temp/remove-permission-duplicates');
    const directus = context.getDirectus();
    const client = directus.get();

    // Create permissions
    const role = await newRole(client);
    const policy = await newPolicy(client, role.id);
    const publicPolicy = await newPolicy(client, null);
    const update1 = await newPermission(client, policy.id, 'panels', 'update');
    const create1 = await newPermission(client, policy.id, 'panels', 'create');
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
    await sync.removePermissionDuplicates('first');

    // Able to read the permissions
    const permissions = await readNonSystemPermissions(client);

    expect(permissions.some((p) => p.id === update1.id)).toBeTrue();
    expect(permissions.some((p) => p.id === create1.id)).toBeTrue();
    expect(permissions.some((p) => p.id === delete1.id)).toBeTrue();
    expect(permissions.some((p) => p.id === read1.id)).toBeTrue();
  });
};
