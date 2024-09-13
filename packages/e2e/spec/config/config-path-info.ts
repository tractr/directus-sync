import { Context } from '../helpers/index.js';

export const configPathInfo = (context: Context) => {
  it('ensure logs show info about missing config file when wrong path is provided', async () => {
    // Init sync client
    const sync = await context.getSync(
      'sources/empty-collections',
      'wrong-path/directus-sync.config.cjs',
    );

    const output = await sync.diff();
    const log = output.find((l) => l.msg.includes('No config file found'));

    expect(log).toBeDefined();
    expect(log?.msg).toContain('wrong-path/directus-sync.config.cjs');
  });

  it('ensure log shows info about missing config file for default files', async () => {
    // Init sync client
    const sync = await context.getSync('sources/empty-collections');

    const output = await sync.diff();
    const log = output.find((l) => l.msg.includes('No config file found'));

    expect(log).toBeDefined();
    expect(log?.msg).toContain('e2e/directus-sync.config.cjs');
    expect(log?.msg).toContain('e2e/directus-sync.config.js');
    expect(log?.msg).toContain('e2e/directus-sync.config.json');
  });

  it('ensure logs show info when config path exists', async () => {
    // Init sync client
    const sync = await context.getSync(
      'sources/empty-collections',
      'config-path-info/directus-sync.config.cjs',
    );

    const output = await sync.diff();
    const log = output.find((l) => l.msg.includes('Loaded config file from'));

    expect(log?.msg).toContain('config-path-info/directus-sync.config.cjs');
  });
};
