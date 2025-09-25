import { Context, debug } from '../helpers/index.js';

export const syncIdMap = (context: Context) => {
  it('should exclude sync id map from the snapshot', async () => {
    // --------------------------------------------------------------------
    // Init sync client and push
    const sync = await context.getSync('sources/snapshot-with-sync-id-map');

    const diffOutput = await sync.diff();
    expect(diffOutput).toContain(debug('[snapshot] No changes to apply'));

    const pushOutput = await sync.push();
    expect(pushOutput).toContain(debug('[snapshot] No changes to apply'));
  });
};
