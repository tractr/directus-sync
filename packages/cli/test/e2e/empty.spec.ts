import { DirectusInstance, DirectusSync, getSetupTimeout } from './sdk';
import Path from 'path';
import { rmSync } from 'fs-extra';

describe('Pull configs', () => {
  const dumpPath = Path.resolve(__dirname, 'dumps/empty');
  const instance = new DirectusInstance('sample-test');
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
  }, getSetupTimeout());
  afterAll(() => {
    instance.stop();
  }, getSetupTimeout());

  it('should pull even if nothing custom in Directus', async () => {
    const output = await sync.pull();
    expect(output.stderr).toBe('');
    expect(output.stdout).toContain('Done');
  });
});
