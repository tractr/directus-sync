import { createUser, DirectusPolicy, readUser } from '@directus/sdk';
import {
  Context,
  getDumpedSystemCollectionsContents,
  newPolicy,
  newRole,
  Schema,
} from '../helpers/index.js';

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

  it('should not include user-attached accesses in dump on pull', async () => {
    const sync = await context.getSync(
      'temp/push-with-user-policy-assignment-pull-filter',
    );
    const directus = context.getDirectus();
    const client = directus.get();

    // Create a role and policy
    const role = await newRole(client);
    const policy = await newPolicy(client, role.id);

    // Assign the policy directly to a user (creates role=null, user=uuid access)
    await client.request(
      createUser({
        email: `user-policy-pull-${Date.now()}@example.com`,
        password: 'password123',
        role: role.id,
        policies: [{ policy: policy.id, role: null, sort: 1 }],
      } as Partial<DirectusPolicy<Schema>>),
    );

    // Pull
    await sync.pull();

    // Read the dump — user-attached accesses (role=null, user=uuid) must be absent
    const { policies } = getDumpedSystemCollectionsContents(sync.getDumpPath());
    type DumpAccess = { role: string | null; user?: string | null };
    const userAttachedInDump = (policies ?? []).flatMap(
      (p: Record<string, unknown>) =>
        ((p.roles as unknown as DumpAccess[] | undefined) ?? []).filter(
          (r) => r.role === null && r.user != null,
        ),
    );
    expect(userAttachedInDump.length).toBe(0);
  });
};
