import {
  Context,
  getDumpedSystemCollectionsContents,
  readAllSystemCollections,
  warn,
} from '../helpers/index.js';

export const pushWithExistingUuid = (context: Context) => {
  it('delete id map and push again with preserved uuid', async () => {
    // Init sync client
    const sync = await context.getSync('sources/one-item-per-collection');
    const dumpPath = sync.getDumpPath();
    const directus = context.getDirectus();
    const client = directus.get();
    const jsonCollections = getDumpedSystemCollectionsContents(dumpPath);

    // Push the data to Directus
    await sync.push();

    // Untrack a flow and a folder
    const flowId = jsonCollections.flows[0]?._syncId;
    const folderId = jsonCollections.folders[0]?._syncId;
    if (!flowId || !folderId) {
      throw new Error('Flow or folder id is missing');
    }
    await sync.untrack('flows', flowId);
    await sync.untrack('folders', folderId);

    expect(await directus.getSyncIdMaps('flows')).toHaveSize(0);
    expect(await directus.getSyncIdMaps('folders')).toHaveSize(0);

    // Count items
    const beforeCollections = await readAllSystemCollections(client);
    expect(beforeCollections.flows).toHaveSize(1);
    expect(beforeCollections.folders).toHaveSize(1);

    // Push the data to Directus
    const pushOutput = await sync.push();

    // Analyze the output
    expect(pushOutput).toContain(
      warn(
        `[flows] Item ${flowId} already exists but id map was missing. Will recreate id map.`,
      ),
    );
    expect(pushOutput).toContain(
      warn(
        `[folders] Item ${folderId} already exists but id map was missing. Will recreate id map.`,
      ),
    );

    // Count items
    const afterCollections = await readAllSystemCollections(client);
    expect(afterCollections.flows).toHaveSize(1);
    expect(afterCollections.folders).toHaveSize(1);

    // Count the ids map
    expect(await directus.getSyncIdMaps('flows')).toHaveSize(1);
    expect(await directus.getSyncIdMaps('folders')).toHaveSize(1);
  });
};
