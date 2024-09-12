import { Context } from '../helpers/index.js';

export const configPathInfo = (context: Context) => {
  it('ensure logs show info about missing config file when wrong path is provided', async () => {
    // Init sync client
    const sync = await context.getSync(
      'sources/empty-collections',
      'wrong-path/directus-sync.config.cjs',
    );

    const output = await sync.diff();
    const first = output.shift();

    expect(first?.msg).toContain('No config file found');
    expect(first?.msg).toContain('wrong-path/directus-sync.config.cjs');
  });

  it('ensure log shows info about missing config file for default files', async () => {
    // Init sync client
    const sync = await context.getSync('sources/empty-collections');

    const output = await sync.diff();
    const first = output.shift();

    expect(first?.msg).toContain('No config file found');
    expect(first?.msg).toContain('e2e/directus-sync.config.cjs');
    expect(first?.msg).toContain('e2e/directus-sync.config.js');
    expect(first?.msg).toContain('e2e/directus-sync.config.json');
  });

  it('ensure logs show info when config path exists', async () => {
    // Init sync client
    const sync = await context.getSync(
      'sources/empty-collections',
      'config-path-info/directus-sync.config.cjs',
    );

    const output = await sync.diff();
    const first = output.shift();

    expect(first?.msg).toContain('Loaded config file from');
    expect(first?.msg).toContain('config-path-info/directus-sync.config.cjs');
  });
};
