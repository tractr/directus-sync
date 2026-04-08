import {
  createPolicy,
  DirectusPolicy,
  readPolicy,
  updatePolicy,
} from '@directus/sdk';
import { Context, getPolicy, newRole, Schema } from '../helpers/index.js';

/**
 * Regression test for https://github.com/tractr/directus-sync/issues/199
 *
 * When `--no-sync-policy-roles` is passed, role ↔ policy attachments
 * (directus_access entries) must be left untouched on the target,
 * even when the local dump's policies have a different set of attachments.
 */
export const pushWithNoSyncPolicyRoles = (context: Context) => {
  it('should leave existing role-policy attachments untouched when --no-sync-policy-roles is set', async () => {
    const sync = await context.getSync('temp/push-with-no-sync-policy-roles');
    const directus = context.getDirectus();
    const client = directus.get();

    const role = (roleId: string) => (access: { role: string }) =>
      access.role === roleId;

    // Local roles: role1 + role2 attached to the policy
    const role1 = await newRole(client);
    const role2 = await newRole(client);

    const policy = await client.request(
      createPolicy({
        ...getPolicy(null),
        roles: [
          { role: role1.id, sort: 1 },
          { role: role2.id, sort: 2 },
        ],
      } as unknown as DirectusPolicy<Schema>),
    );

    // Pull the current state (with attachments) using the default behavior
    await sync.pull();

    // Simulate "production": a third role gets attached and the original
    // role1 attachment is removed by an admin on the target instance.
    const role3 = await newRole(client);
    const currentPolicy = await client.request(
      readPolicy(policy.id, { fields: ['id', 'roles.*'] }),
    );
    const role1Access = currentPolicy.roles.find(role(role1.id));
    await client.request(
      updatePolicy(policy.id, {
        roles: {
          create: [{ role: role3.id, sort: 3 }],
          update: [],
          delete: [role1Access.id],
        },
      } as unknown as DirectusPolicy<Schema>),
    );

    // Sanity check: target now has role2 + role3 (no role1)
    const beforePush = await client.request(
      readPolicy(policy.id, { fields: ['id', 'roles.*'] }),
    );
    expect(beforePush.roles.length).toBe(2);
    expect(beforePush.roles.find(role(role1.id))).toBeUndefined();
    expect(beforePush.roles.find(role(role2.id))).toBeDefined();
    expect(beforePush.roles.find(role(role3.id))).toBeDefined();

    // Push with --no-sync-policy-roles: target attachments must be preserved
    await sync.push(['--no-sync-policy-roles']);

    const afterPush = await client.request(
      readPolicy(policy.id, { fields: ['id', 'roles.*'] }),
    );
    // role1 must NOT have been re-added (local dump still has it, but flag is on)
    expect(afterPush.roles.find(role(role1.id))).toBeUndefined();
    // role3 must NOT have been removed (it's only on the target, not in dump)
    expect(afterPush.roles.find(role(role3.id))).toBeDefined();
    // role2 must still be there
    expect(afterPush.roles.find(role(role2.id))).toBeDefined();
    expect(afterPush.roles.length).toBe(2);
  });

  it('should not dump role attachments on pull when --no-sync-policy-roles is set', async () => {
    const sync = await context.getSync('temp/pull-with-no-sync-policy-roles');
    const directus = context.getDirectus();
    const client = directus.get();

    const role1 = await newRole(client);
    const policy = await client.request(
      createPolicy({
        ...getPolicy(null),
        roles: [{ role: role1.id, sort: 1 }],
      } as unknown as DirectusPolicy<Schema>),
    );

    await sync.pull(['--no-sync-policy-roles']);

    // Read back the dumped policy file and assert no roles attachments
    const fs = await import('fs-extra');
    const path = await import('path');
    const collectionsDir = path.resolve(
      sync.getDumpPath(),
      'collections',
      'policies',
    );
    const files = (await fs.readdir(collectionsDir)).filter((f) =>
      f.endsWith('.json'),
    );
    const dumped = await Promise.all(
      files.map(
        (f) =>
          fs.readJSON(path.join(collectionsDir, f)) as Promise<{
            name?: string;
            roles?: unknown[];
          }>,
      ),
    );
    const ourPolicy = dumped.find((p) => p.name === policy.name);
    expect(ourPolicy).toBeDefined();
    // roles must be absent or empty (we did not query them)
    expect(ourPolicy?.roles ?? []).toEqual([]);
  });
};
