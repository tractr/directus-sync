import {
  Context,
  getDumpedSystemCollectionsContents,
} from '../helpers/index.js';

export const operationsWithDynamicFlowId = (context: Context) => {
  it('should not map or transform dynamic flow id inside operation options', async () => {
    const sync = await context.getSync('sources/operations-dynamic-flow-id');

    // Push the data to Directus
    await sync.push();

    // Pull back to verify dump persists dynamic value untouched
    await sync.pull();

    const collections = getDumpedSystemCollectionsContents(sync.getDumpPath());
    expect(collections.operations).toBeDefined();
    const [operation] = collections.operations ?? [];
    expect(operation).toBeDefined();
    // Assert dynamic placeholder is kept as-is and not converted to any id map
    if (!operation) throw new Error('Operation not found in dump');
    expect(operation.options?.flow).toBe('{{ dynamic_flow_id }}');
  });
};
