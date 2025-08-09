import { runSequentially } from './sequential';

describe('runSequentially', () => {
  it('executes tasks strictly in order and returns their results', async () => {
    const executionOrder: number[] = [];
    const tasks = [
      () => {
        executionOrder.push(1);
        return Promise.resolve('a');
      },
      () => {
        executionOrder.push(2);
        return Promise.resolve('b');
      },
      () => {
        executionOrder.push(3);
        return Promise.resolve('c');
      },
    ];

    const results = await runSequentially(tasks);
    expect(executionOrder).toEqual([1, 2, 3]);
    expect(results).toEqual(['a', 'b', 'c']);
  });

  it('propagates the first rejection and stops subsequent execution', async () => {
    const executionOrder: number[] = [];
    const tasks = [
      () => {
        executionOrder.push(1);
        return Promise.resolve('ok-1');
      },
      () => {
        executionOrder.push(2);
        throw new Error('boom');
      },
      () => {
        executionOrder.push(3);
        return Promise.resolve('ok-3');
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
