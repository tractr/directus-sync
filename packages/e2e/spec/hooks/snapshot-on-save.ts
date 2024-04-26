import { Context } from '../helpers/index.js';
import Path from 'path';
import fs from 'fs-extra';

export const snapshotOnSave = (context: Context) => {
  it('ensure on load hook can change the snapshot', async () => {
    // Init sync client and load the snapshot
    const syncInit = await context.getSync(
      'sources/snapshot-with-custom-model',
      false,
    );
    await syncInit.push();

    // --------------------------------------------------------------------
    // Pull the snapshot to a new dump
    const sync = await context.getSync(
      'temp/snapshot-on-save',
      true,
      'snapshot-on-save/directus-sync.config.cjs',
    );
    await sync.pull();

    // --------------------------------------------------------------------
    // Check if the content was dumped correctly
    const dumpPath = sync.getDumpPath();
    const snapshotPath = Path.join(dumpPath, 'snapshot');

    const collectionFiles = fs.readdirSync(
      Path.join(snapshotPath, 'collections'),
    );
    expect(collectionFiles).toEqual([
      'directus_sync_id_map.json',
      'test_model.json',
    ]);

    const fields = fs.readdirSync(
      Path.join(snapshotPath, 'fields', 'test_model'),
    );
    expect(fields).toEqual([
      'content.json',
      'date_updated.json',
      'enabled.json',
      'id.json',
      'name.json',
      'sort.json',
      'status.json',
      'user_updated.json',
    ]);

    const relations = fs.readdirSync(
      Path.join(snapshotPath, 'relations', 'test_model'),
    );
    expect(relations).toEqual(['user_updated.json']);
  });
};
