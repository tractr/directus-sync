import { interval, merge, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

import { sleep } from './sleep';
import { waitUntilDebounced } from './wait-until-debounced';

describe('waitUntilDebounced', () => {
  it('Wait until an event is completed', (done) => {
    let value = 0;
    waitUntilDebounced(interval(10)).then(
      () => {
        value += 1;
        done();
      },
      (e) => done.fail(e),
    );

    sleep(5).then(
      () => {
        expect(value).toEqual(0);
      },
      (e) => done.fail(e),
    );
  });

  it('Wait until stop debounce', (done) => {
    let value = 0;

    const stream$ = merge(timer(4), timer(8), timer(15)).pipe(
      tap(() => ++value),
    );

    waitUntilDebounced(stream$, 5).then(
      () => {
        expect(value).toEqual(2);
        done();
      },
      (e) => done.fail(e),
    );
  });
});
