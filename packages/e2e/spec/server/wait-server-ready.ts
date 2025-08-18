import { Context, info } from '../helpers/index.js';

export const waitServerReady = (context: Context) => {
  it('should wait for the server to be ready', async () => {
    const sync = await context.getSync('temp/wait-server-ready');

    const output = await sync.waitServerReady(1, 10);

    expect(output).toContain(info('[helpers-client] Server is ready'));
  });
};
