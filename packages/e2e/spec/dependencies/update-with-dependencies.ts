import { Context, info } from '../helpers/index.js';

export const updateWithDependencies = (context: Context) => {
  fit('reverse 2 operations dependencies', async () => {
    // Init sync client
    const syncInit = await context.getSync(
      'sources/multiple-dependencies',
      false,
    );
    const directus = context.getDirectus();

    await syncInit.push();

    const beforePushDate = new Date();
    const sync = await context.getSync(
      'sources/multiple-dependencies-reversed',
      false,
    );
    const output = await sync.push();

    expect(output).toContain(info(`[operations] Deleted 0 dangling items`));
    expect(output).toContain(info(`[operations] Created 0 items`));
    expect(output).toContain(info(`[operations] Updated 3 items`));
    expect(output).toContain(info(`[operations] Deleted 0 items`));

    // Ensure that no activities were created
    const activities = (await directus.getActivities(beforePushDate)).filter(
      (a) => a.collection === 'directus_operations',
    );
    expect(activities.filter((a) => a.action === 'create')).toEqual([]);
    expect(activities.filter((a) => a.action === 'delete')).toEqual([]);

    // One extra to nullify the resolve column and avoid unique constraint conflict
    expect(activities.filter((a) => a.action === 'update').length).toEqual(4);
  });
};
