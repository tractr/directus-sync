import { firstValueFrom, Observable } from 'rxjs';
import { take, timeout } from 'rxjs/operators';

export function waitUntil<T>(
  event$: Observable<T>,
  dueTime?: number,
): Promise<T | undefined> {
  const stream$ = dueTime ? event$.pipe(timeout(dueTime)) : event$;
  return firstValueFrom(stream$.pipe(take(1)));
}
