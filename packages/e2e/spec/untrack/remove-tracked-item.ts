import { Context, newPermission, newRole } from '../helpers/index.js';

export const removeTrackedItem = (context: Context) => {
  it('should remove entry from tracked ids map', async () => {
    // Init sync client
    const sync = await context.getSync('temp/remove-tracked-item');
    const directus = context.getDirectus();
    const client = directus.get();

    // Create new permissions
    const role = await newRole(client);
    await newPermission(client, role.id, 'panels', 'update');
    const perm = await newPermission(client, role.id, 'panels', 'create');
    await newPermission(client, null, 'panels', 'delete');
    await newPermission(client, null, 'panels', 'read');

    // Pull data to create the tracked ids map
    await sync.pull();

    // Remove the permissions
    await sync.untrack('permissions', perm.id);

    // Get the tracked ids map
    const idMaps = await directus.getSyncIdMaps('permissions');
    expect(idMaps.length).toBe(3);
    expect(idMaps.map((idMap) => idMap.local_id)).not.toContain(
      perm.id.toString(),
    );
  });
};
