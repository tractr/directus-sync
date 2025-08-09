import { runSequentially } from './sequential';

describe('runSequentially', () => {
  it('executes tasks strictly in order and returns their results', async () => {
    const executionOrder: number[] = [];
    const tasks = [
      async () => {
        executionOrder.push(1);
        return 'a';
      },
      async () => {
        executionOrder.push(2);
        return 'b';
      },
      async () => {
        executionOrder.push(3);
        return 'c';
      },
    ];

    const results = await runSequentially(tasks);
    expect(executionOrder).toEqual([1, 2, 3]);
    expect(results).toEqual(['a', 'b', 'c']);
  });

  it('propagates the first rejection and stops subsequent execution', async () => {
    const executionOrder: number[] = [];
    const tasks = [
      async () => {
        executionOrder.push(1);
        return 'ok-1';
      },
      async () => {
        executionOrder.push(2);
        throw new Error('boom');
      },
      async () => {
        executionOrder.push(3);
        return 'ok-3';
      },
    ];

    await expect(runSequentially(tasks)).rejects.toThrow('boom');
    expect(executionOrder).toEqual([1, 2]);
  });

  it('works with an empty list', async () => {
    const results = await runSequentially([]);
    expect(results).toEqual([]);
  });
});
