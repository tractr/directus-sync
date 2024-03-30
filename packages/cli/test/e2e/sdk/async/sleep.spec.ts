import { sleep } from './sleep';

describe('sleep', () => {
  it('sleep and check time', async () => {
    const before = Date.now();
    await sleep(500);
    const after = Date.now();
    const elapsed = after - before;
    expect(elapsed).toBeLessThan(520);
    expect(elapsed).toBeGreaterThan(480);
  });
});
