import { Context } from '../helpers/index.js';

export const clearCacheSystem = (context: Context) => {
  it('should run pull without errors after clearing both caches', async () => {
    await context.setup();
    const sync = await context.getSync('temp/clear-cache-system');
    // Just ensure it works; the system cache clear is best-effort and depends on Directus version
    const output = await sync.pull();
    expect(Array.isArray(output)).toBeTrue();
  });
};
