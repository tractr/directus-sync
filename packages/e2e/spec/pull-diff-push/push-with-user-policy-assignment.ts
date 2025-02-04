import { createUser, DirectusPolicy, readUser } from '@directus/sdk';
import { Context, newPolicy, newRole, Schema } from '../helpers/index.js';

export const pushWithUserPolicyAssignment = (context: Context) => {
  it('should preserve user policy assignments after push', async () => {
    // Init sync client
    const sync = await context.getSync('temp/push-with-user-policy-assignment');
    const directus = context.getDirectus();
    const client = directus.get();

    // Helpers
    const extractPolicyId = (p: { policy: string }) => p.policy;

    // Create a role
    const role = await newRole(client);

    // Create a policy
    const policy = await newPolicy(client, role.id);

    // Pull the current state
    await sync.pull();

    // Create a user and assign the policy
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      role: role.id,
      policies: [
        {
          policy: policy.id,
          role: null,
          sort: 1,
        },
      ],
    } as Partial<DirectusPolicy<Schema>>;
    const user = await client.request(createUser(userData));

    // Verify the initial state
    const initialUser = await client.request(
      readUser(user.id, {
        fields: ['*', 'policies.*'],
      }),
    );
    expect(initialUser.policies.map(extractPolicyId)).toContain(policy.id);

    // Push the data
    await sync.push();

    // Verify that the user still has the policy assigned
    const finalUser = await client.request(
      readUser(user.id, {
        fields: ['id', 'policies.*'],
      }),
    );
    expect(finalUser.policies.map(extractPolicyId)).toContain(policy.id);
  });
};
