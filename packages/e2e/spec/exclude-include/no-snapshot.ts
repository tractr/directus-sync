import {
  Context,
  debug,
} from '../helpers/index.js';
import Path from 'path';
import fs from 'fs-extra';

export const noSnapshot = (context: Context) => {
  it('should not pull schema from Directus', async () => {
    // Init sync client
    const sync = await context.getSync('temp/no-snapshot');

    // --------------------------------------------------------------------
    // Pull the content from Directus
    const output = await sync.pull(['--no-snapshot']);

    // --------------------------------------------------------------------
    // Check that the snapshot was ignored
    expect(output).toContain(debug('Snapshot is disabled'));

    // --------------------------------------------------------------------
    // Check if the content was dumped correctly
    const dumpPath = sync.getDumpPath();
    const snapshotPath = Path.join(dumpPath, 'snapshot');
    // Ensure folder is empty
    const files = fs.readdirSync(snapshotPath);
    expect(files).toEqual([]);
  });

  it('should not diff schema from Directus', async () => {
    // Init sync client
    const sync = await context.getSync('sources/one-item-per-collection', false);

    // --------------------------------------------------------------------
    // Pull the content from Directus
    const output = await sync.diff(['--no-snapshot']);

    // --------------------------------------------------------------------
    // Check that the snapshot was ignored
    expect(output).toContain(debug('Snapshot is disabled'));
    expect(output).not.toContain(debug('[snapshot] No changes to apply'));

  });

  it('should not diff schema from Directus', async () => {
    // Init sync client
    const sync = await context.getSync('sources/one-item-per-collection', false);

    // --------------------------------------------------------------------
    // Pull the content from Directus
    const output = await sync.push(['--no-snapshot']);

    // --------------------------------------------------------------------
    // Check that the snapshot was ignored
    expect(output).toContain(debug('Snapshot is disabled'));
    expect(output).not.toContain(debug('[snapshot] No changes to apply'));

  });
};
