import { Context, debug, getAllItems, info } from '../helpers/index.js';

export const seedUsers = (context: Context) => {
	it('seed push for directus_users and verify roles', async () => {
		// Init sync client
		const sync = await context.getSync('sources/seed-users');
		const directus = context.getDirectus();
		const client = directus.get();

		// Push schema first
		await sync.push();

		// Check differences for seeds (optional sanity)
		const diffOutput = await sync.seedDiff();
		expect(diffOutput).toContain(info('[directus_users] To create: 2 item(s)'));
		expect(diffOutput).toContain(debug('[directus_users] To update: 0 item(s)'));
		expect(diffOutput).toContain(debug('[directus_users] To delete: 0 item(s)'));

		// Push data seeds to Directus
		const beforePushDate = new Date();
		const pushOutput = await sync.seedPush();

		// Analyze output
		expect(pushOutput).toContain(info('[directus_users] Created 2 items'));
		expect(pushOutput).toContain(debug('[directus_users] Updated 0 items'));
		expect(pushOutput).toContain(debug('[directus_users] Deleted 0 items'));

		// Check that activities have been created
		const activities = await directus.getActivities(beforePushDate);
		const createdUsers = activities.filter(
			(a) => a.action === 'create' && a.collection === 'directus_users',
		);
		expect(createdUsers.length).toEqual(2);

		// Fetch users and roles
		const users = await getAllItems<any>(client, 'directus_users');
		const roles = await getAllItems<any>(client, 'directus_roles');

		const adminRole = roles.find((r) => r.name === 'Administrator');
		expect(adminRole).toBeDefined();

		const john = users.find((u) => u.email === 'john.doe@example.com');
		expect(john).toBeDefined();
		expect(john.role).toEqual(adminRole.id);

		const jane = users.find((u) => u.email === 'jane.smith@example.com');
		expect(jane).toBeDefined();
		expect(jane.role === null || jane.role === undefined).toBeTrue();
	});
};


