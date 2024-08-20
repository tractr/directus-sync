import {
  Context,
  newPermission,
  newPolicy,
  newRole,
  readNonSystemPermissions,
  warn,
} from '../helpers/index.js';
import { deletePermissions } from '@directus/sdk';

export const insertDuplicatedPermissions = (context: Context) => {
  it('should remove duplicates when inserting permissions', async () => {
    // Init sync client
    const sync = await context.getSync('temp/insert-duplicated-permissions');
    const directus = context.getDirectus();
    const client = directus.get();

    // Create existing resources
    const role = await newRole(client);
    const policy = await newPolicy(client, role.id);
    const publicPolicy = await newPolicy(client, null);
    const initialPermissions = [
      await newPermission(client, policy.id, 'panels', 'update'),
      await newPermission(client, publicPolicy.id, 'panels', 'delete'),
    ];

    // Dump the data
    await sync.pull();

    // Remove the existing permissions
    await client.request(
      deletePermissions(initialPermissions.map((p) => p.id)),
    );

    // Create new permissions
    await newPermission(client, policy.id, 'panels', 'update');
    await newPermission(client, policy.id, 'panels', 'create');
    await newPermission(client, publicPolicy.id, 'panels', 'delete');
    await newPermission(client, publicPolicy.id, 'panels', 'read');

    // Push back the data
    const beforePushDate = new Date();
    const output = await sync.push();

    // Check the output
    expect(output).toContain(
      warn(
        `[permissions] Found duplicate permissions for directus_panels.update with policy ${policy.id}. Deleting them.`,
      ),
    );
    expect(output).toContain(
      warn(
        `[permissions] Found duplicate permissions for directus_panels.update with policy ${publicPolicy.id}. Deleting them.`,
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

    // --------------------------------------------------------------------
    // Ensure that activities were created or not
    const activities = await directus.getActivities(beforePushDate);
    const deletions = activities.filter(
      (a) => a.action === 'delete' && a.collection === 'directus_permissions',
    );
    expect(deletions.length).toEqual(2);
  });
};
