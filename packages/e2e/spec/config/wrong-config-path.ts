import { Context, DirectusSyncNotConfigured } from '../helpers/index.js';

export const wrongConfigPath = (context: Context) => {
  fit('ensure the right message is sent if the wrong config path is provided', async () => {
    // Init sync client
    const sync = await context.getSync(
      'temp/wrong-config-path',
      'wrong-path/directus-sync.config.cjs',
    );

    const error = await sync.diff().catch((error: Error) => error.message);

    expect(error).toContain('no such file or directory');
  });

  fit('ensure the right message is sent when missing values and no default config file found', async () => {
    // Init sync client
    const sync = await context.getSync(
      'temp/wrong-config-path',
      undefined,
      DirectusSyncNotConfigured,
    );

    const error = await sync.diff().catch((error: Error) => error.message);
    console.log(error);

    expect(error).toContain('no such file or directory');
  });
};
