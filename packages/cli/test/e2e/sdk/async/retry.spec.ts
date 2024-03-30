import { retry } from './retry';

describe('retry', () => {
  it('should retry until success', async () => {
    let counter = 0;
    const run = () => {
      counter++;
      if (counter < 3) {
        throw new Error('error');
      }
      return 'success';
    };
    const result = await retry(run);
    expect(result).toEqual('success');
  });

  it('should fail after max retries', async () => {
    let counter = 0;
    const run = () => {
      counter++;
      throw new Error('error');
    };
    try {
      await retry(run, 3, 0);
    } catch (error) {
      expect((error as Error).message).toEqual('error');
      expect(counter).toEqual(3);
    }
  });
});
