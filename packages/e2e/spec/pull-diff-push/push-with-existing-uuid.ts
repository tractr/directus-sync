import {
  Context,
  getDumpedSystemCollectionsContents,
  warn,
} from '../helpers/index.js';

export const pushWithExistingUuid = (context: Context) => {
  fit('diff and push on an empty instance', async () => {
    // Init sync client
    const sync = await context.getSync('sources/one-item-per-collection');
    const dumpPath = sync.getDumpPath();
    const collections = getDumpedSystemCollectionsContents(dumpPath);

    // Push the data to Directus
    await sync.push();

    // Untrack a flow and a folder
    const flowId = collections.flows[0]?._syncId!;
    const folderId = collections.folders[0]?._syncId!;
    await sync.untrack('flows', flowId);
    await sync.untrack('folders', folderId);

    // Push the data to Directus
    const pushOutput = await sync.push();

    // Analyze the output
    expect(pushOutput).toContain(
      warn(`[flows] Recreated sync id map for ${flowId}`),
    );
    expect(pushOutput).toContain(
      warn(`[folders] Recreated sync id map for ${folderId}`),
    );
  });
};
