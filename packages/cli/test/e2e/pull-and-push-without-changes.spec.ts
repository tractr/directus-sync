import {
  DirectusInstance,
  DirectusSync,
  getSetupTimeout,
  getSystemCollectionsNames,
  info,
  isPinoHTTPLog,
} from './sdk';
import Path from 'path';
import { rmSync } from 'fs-extra';
import { createOneItemInEachSystemCollection } from './utils';

describe('Pull, diff and push without changes', () => {
  const fileName = Path.basename(__filename, '.spec.ts');
  const dumpPath = Path.resolve(__dirname, 'dumps', fileName);
  const instance = new DirectusInstance();
  const directus = instance.getDirectusClient();
  let sync: DirectusSync;

  beforeAll(async () => {
    rmSync(dumpPath, { recursive: true, force: true });
    await instance.start();
    await directus.loginAsAdmin();
    sync = new DirectusSync({
      token: await directus.requireToken(),
      url: directus.getUrl(),
      dumpPath: dumpPath,
    });

    // -----------------------------------
    // Populate the instance with some data and pull them
    await createOneItemInEachSystemCollection(directus.get());
    await sync.pull();
    // -----------------------------------
  }, getSetupTimeout());
  afterAll(() => {
    instance.stop();
  });

  it('no diff if no changes', async () => {
    const output = await sync.diff();

    expect(output).toContainEqual(info('[snapshot] No changes to apply'));

    const collections = getSystemCollectionsNames();

    for (const collection of collections) {
      expect(output).toContainEqual(
        info(`[${collection}] Dangling id maps: 0 item(s)`),
      );
      expect(output).toContainEqual(
        info(`[${collection}] To create: 0 item(s)`),
      );
      expect(output).toContainEqual(
        info(`[${collection}] To update: 0 item(s)`),
      );
      expect(output).toContainEqual(
        info(`[${collection}] To delete: 0 item(s)`),
      );
      expect(output).toContainEqual(
        info(`[${collection}] Unchanged: 1 item(s)`),
      );
    }
  });

  it('should not create or update any entries in Directus', async () => {
    // Push the data back to Directus and trigger a ping in order to detect the end of the push
    const pushPromise = sync.push().then(async (output) => {
      await directus.ping();
      return output;
    });

    // Throw an error if a mutation is done during the push
    await instance.waitForLog(
      (log) => isPinoHTTPLog(log) && log.req.url === '/server/ping',
      (log) => {
        if (!isPinoHTTPLog(log)) return false;
        const forbiddenMethods = ['POST', 'PATCH', 'DELETE', 'PUT'];
        const allowedURLs = [
          '/utils/cache/clear',
          '/schema/diff',
          '/auth/login',
        ];
        const { method, url } = log.req;
        return forbiddenMethods.includes(method) && !allowedURLs.includes(url);
      },
      20000,
    );

    // Analyze the output
    const output = await pushPromise;
    const collections = getSystemCollectionsNames();
    expect(output).toContainEqual(info('[snapshot] No changes to apply'));
    for (const collection of collections) {
      expect(output).toContainEqual(
        info(`[${collection}] Deleted 0 dangling items`),
      );
      expect(output).toContainEqual(info(`[${collection}] Created 0 items`));
      expect(output).toContainEqual(info(`[${collection}] Updated 0 items`));
      if (collection !== 'settings') {
        expect(output).toContainEqual(info(`[${collection}] Deleted 0 items`));
      }
    }
  });
});
