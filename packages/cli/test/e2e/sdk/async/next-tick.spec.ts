import { nextTick } from './next-tick';

describe('nextTick', () => {
  it('Wait next tick to perform increment', (done) => {
    let value = 0;
    nextTick().then(
      () => {
        value += 1;
        done();
      },
      (e: string) => done.fail(e),
    );
    expect(value).toEqual(0);
  });
});
