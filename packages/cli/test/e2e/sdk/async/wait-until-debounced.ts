import { firstValueFrom, Observable } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';

export function waitUntilDebounced<T>(
  event$: Observable<T>,
  dueTime = 0,
): Promise<T | undefined> {
  return firstValueFrom(event$.pipe(debounceTime(dueTime), take(1)));
}
