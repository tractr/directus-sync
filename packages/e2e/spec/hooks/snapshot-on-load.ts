import {
  Context,
  readAllCollectionsFieldsAndRelations,
} from '../helpers/index.js';

export const snapshotOnLoad = (context: Context) => {
  it('ensure on load hook can change the snapshot', async () => {
    // Init sync client
    const sync = await context.getSync(
      'sources/snapshot-with-custom-model',
      'snapshot-on-load/directus-sync.config.cjs',
    );
    const directus = context.getDirectus();
    await sync.push();

    // --------------------------------------------------------------------
    // Check if the content was changed correctly
    const client = directus.get();
    const { collections, fields, relations } =
      await readAllCollectionsFieldsAndRelations(client);

    const nonSystemCollections = collections.filter(
      (c) => !c.collection.startsWith('directus_'),
    );
    expect(nonSystemCollections.length).toEqual(1);
    expect(
      nonSystemCollections.find((c) => c.collection === 'test_model'),
    ).toBeDefined();

    const testModelFields = fields.filter((f) => f.collection === 'test_model');
    expect(testModelFields.length).toEqual(8);
    expect(
      testModelFields.find((f) => f.field === 'user_created'),
    ).toBeUndefined();
    expect(
      testModelFields.find((f) => f.field === 'date_created'),
    ).toBeUndefined();

    const testModelRelations = relations.filter(
      (r) => r.collection === 'test_model',
    );
    expect(testModelRelations.length).toEqual(1);
    expect(
      testModelRelations.find((r) => r.field === 'user_created'),
    ).toBeUndefined();
  });
};
