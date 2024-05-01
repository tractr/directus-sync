import { Context, getPermission, getRole, warn } from '../helpers/index.js';
import {
  createPermission,
  createRole,
  deletePermissions,
  DirectusPermission,
  readPermissions,
} from '@directus/sdk';

type PermissionWithSystem = DirectusPermission<object> & { system: boolean };

export const insertDuplicatePermissions = (context: Context) => {
  it('should remove duplicates when inserting permissions', async () => {
    // Init sync client
    const sync = await context.getSync('temp/insert-duplicates-permissions');
    const directus = context.getDirectus();
    const client = directus.get();

    // Create existing resources
    const role = await client.request(createRole(getRole()));
    const initialPermissions = [
      await client.request(
        createPermission(getPermission(role.id, 'panels', 'update')),
      ),
      await client.request(
        createPermission(getPermission(null, 'panels', 'delete')),
      ),
    ];

    // Dump the data
    await sync.pull();

    // Remove the existing permissions
    await client.request(
      deletePermissions(initialPermissions.map((p) => p.id)),
    );

    // Create new permissions
    await client.request(
      createPermission(getPermission(role.id, 'panels', 'update')),
    );
    await client.request(
      createPermission(getPermission(role.id, 'panels', 'create')),
    );
    await client.request(
      createPermission(getPermission(null, 'panels', 'delete')),
    );
    await client.request(
      createPermission(getPermission(null, 'panels', 'read')),
    );

    // Push back the data
    const beforePushDate = new Date();
    const output = await sync.push();

    // Check the output
    expect(output).toContain(
      warn(
        `[permissions] Found duplicate permissions for directus_panels.update with role ${role.id}. Deleting them.`,
      ),
    );
    expect(output).toContain(
      warn(
        `[permissions] Found duplicate permissions for directus_panels.delete with role null. Deleting them.`,
      ),
    );

    // Able to read the permissions
    const permissions = (
      await client.request<PermissionWithSystem[]>(
        readPermissions({
          fields: ['id', 'role', 'collection', 'action'],
        }),
      )
    ).filter((p) => !p.system);

    expect(permissions.length).toEqual(4);
    for (const permission of permissions) {
      expect(permission.id).toBeDefined();
      expect(permission.role).toBeDefined();
      expect(permission.collection).toBeDefined();
      expect(permission.action).toBeDefined();
    }

    // --------------------------------------------------------------------
    // Ensure that activities were created or not
    const activities = await directus.getActivities(beforePushDate);
    const deletions = activities.filter(
      (a) => a.action === 'delete' && a.collection === 'directus_permissions',
    );
    expect(deletions.length).toEqual(2);
  });
};
