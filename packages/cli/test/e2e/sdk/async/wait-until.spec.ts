import { interval } from 'rxjs';

import { sleep } from './sleep';
import { waitUntil } from './wait-until';

describe('waitUntil', () => {
  it('Wait until an event is completed', (done) => {
    let value = 0;
    waitUntil(interval(10)).then(
      () => {
        value += 1;
        done();
      },
      (e: string) => done.fail(e),
    );
    sleep(5).then(
      () => {
        expect(value).toEqual(0);
      },
      (e: string) => done.fail(e),
    );
  });
  it('Wait until but timeout', (done) => {
    waitUntil(interval(10), 2)
      .then(() => done.fail('Did not throw timeout error'))
      .catch((error) => {
        expect(error.message).toEqual('Timeout has occurred');
        done();
      });
  });
});
