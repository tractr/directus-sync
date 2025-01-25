import {
  Context,
  debug,
  getDumpedSystemCollectionsContents,
  info,
  readAllSystemCollections,
  SystemCollectionsContentWithSyncId,
} from '../helpers/index.js';
import { deleteOperation, updateOperation } from '@directus/sdk';

type OperationFromJson = SystemCollectionsContentWithSyncId['operations'][0];

export const createOperationsWithConflicts = (context: Context) => {
  it('create an operation that conflicts with other', async () => {
    // Init sync client
    const sync = await context.getSync('sources/dependencies-operations');
    const directus = context.getDirectus();
    const client = directus.get();
    await sync.push();

    // Get the sync id map
    let idMaps = await directus.getSyncIdMaps('operations');
    const getLocalId = (syncId: string) => {
      const localId = idMaps.find((m) => m.sync_id === syncId)?.local_id;
      if (!localId) throw new Error(`Local id not found for sync id ${syncId}`);
      return localId;
    };

    // Remove the second operation and make the first one point to the third
    const { operations } = getDumpedSystemCollectionsContents(
      sync.getDumpPath(),
    );
    const [operation1, operation2, operation3] = operations as [
      OperationFromJson,
      OperationFromJson,
      OperationFromJson,
    ];
    await client.request(
      updateOperation(getLocalId(operation1._syncId), {
        resolve: null,
      }),
    );
    await client.request(deleteOperation(getLocalId(operation2._syncId)));
    await client.request(
      updateOperation(getLocalId(operation1._syncId), {
        resolve: getLocalId(operation3._syncId),
      }),
    );

    // Push back the data
    const beforePushDate = new Date();
    const output = await sync.push();

    expect(output).toContain(info(`[operations] Deleted 1 dangling items`));
    expect(output).toContain(info(`[operations] Created 1 items`));
    expect(output).toContain(info(`[operations] Updated 1 items`));
    expect(output).toContain(debug(`[operations] Deleted 0 items`));

    // Ensure that no activities were created
    const activities = (await directus.getActivities(beforePushDate)).filter(
      (a) => a.collection === 'directus_operations',
    );
    expect(activities.filter((a) => a.action === 'create').length).toEqual(1);
    expect(activities.filter((a) => a.action === 'delete')).toEqual([]);

    // One extra to nullify the resolve column and avoid unique constraint conflict
    expect(activities.filter((a) => a.action === 'update').length).toEqual(2);

    // Get the operations ids
    idMaps = await directus.getSyncIdMaps('operations');
    const id1 = getLocalId(operation1._syncId);
    const id2 = getLocalId(operation2._syncId);
    const id3 = getLocalId(operation3._syncId);

    // Get the new operations
    const { operations: newOperations } =
      await readAllSystemCollections(client);
    const newOperation1 = newOperations.find((o) => o.id === id1);
    const newOperation2 = newOperations.find((o) => o.id === id2);
    const newOperation3 = newOperations.find((o) => o.id === id3);

    // Check if hte chain is correct
    expect(newOperation1).toBeDefined();
    expect(newOperation2).toBeDefined();
    expect(newOperation3).toBeDefined();

    expect(newOperation1?.resolve).toEqual(id2);
    expect(newOperation2?.resolve).toEqual(id3);
    expect(newOperation3?.resolve).toBeNull();
  });
};
