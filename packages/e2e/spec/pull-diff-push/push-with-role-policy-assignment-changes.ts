import {
  createPolicy,
  DirectusPolicy,
  readPolicy,
  updatePolicy,
} from '@directus/sdk';
import { Context, getPolicy, newRole, Schema } from '../helpers/index.js';

export const pushWithRolePolicyAssignmentChanges = (context: Context) => {
  it('should apply role policy assignments changes after push', async () => {
    // Init sync client
    const sync = await context.getSync(
      'temp/push-with-role-policy-assignment-changes',
    );
    const directus = context.getDirectus();
    const client = directus.get();

    // Helpers
    const roleAndSort =
      (role: string, sort: number) =>
      (access: { role: string; sort: number }) =>
        access.role === role && access.sort === sort;
    const role = (role: string) => (access: { role: string }) =>
      access.role === role;

    // Create 3 roles
    const role1 = await newRole(client);
    const role2 = await newRole(client);
    const role3 = await newRole(client);

    // Create a policy
    const policy = await client.request(
      createPolicy({
        ...getPolicy(null),
        roles: [
          {
            role: role1.id,
            sort: 1,
          },
          {
            role: role2.id,
            sort: 2,
          },
        ],
      } as unknown as DirectusPolicy<Schema>),
    );

    // Read the policy
    const currentPolicy = await client.request(
      readPolicy(policy.id, {
        fields: ['id', 'roles.*'],
      }),
    );
    const currentAccess1 = currentPolicy.roles.find(role(role1.id));
    const currentAccess2 = currentPolicy.roles.find(role(role2.id));

    // Pull the current state
    await sync.pull();

    // Update the policy
    await client.request(
      updatePolicy(policy.id, {
        roles: {
          create: [
            {
              role: role3.id,
              sort: 3,
            },
          ],
          update: [
            {
              id: currentAccess2.id,
              role: role2.id,
              sort: 20,
            },
          ],
          delete: [currentAccess1.id],
        },
      } as unknown as DirectusPolicy<Schema>),
    );

    // Check that the policy has been updated
    const updatedPolicy = await client.request(
      readPolicy(policy.id, {
        fields: ['id', 'roles.*'],
      }),
    );
    expect(updatedPolicy.roles.length).toBe(2);
    expect(updatedPolicy.roles.find(role(role1.id))).toBeUndefined();
    expect(updatedPolicy.roles.find(roleAndSort(role2.id, 20))).toBeDefined();
    expect(updatedPolicy.roles.find(roleAndSort(role3.id, 3))).toBeDefined();

    // Push the data
    await sync.push();

    // Verify that the user still has the policy assigned
    const finalPolicy = await client.request(
      readPolicy(policy.id, {
        fields: ['id', 'roles.*'],
      }),
    );
    expect(finalPolicy.roles.length).toBe(2);
    expect(finalPolicy.roles.find(roleAndSort(role1.id, 1))).toBeDefined();
    expect(finalPolicy.roles.find(roleAndSort(role2.id, 2))).toBeDefined();
    expect(finalPolicy.roles.find(role(role3.id))).toBeUndefined();
  });
};
