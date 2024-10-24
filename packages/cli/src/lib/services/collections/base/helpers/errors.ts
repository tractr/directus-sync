import type { DirectusError, DirectusRequestError } from '../interfaces';

export function unwrapDirectusRequestError(error: unknown): DirectusError {
  const [nestedError] = (error as DirectusRequestError).errors ?? [];
  if (!nestedError) {
    return {
      message: (error as Error).message ?? 'Unknown error',
      code: 'UNKNOWN_ERROR',
    };
  }
  return {
    message: nestedError.message,
    code: nestedError.extensions?.code,
    collection: nestedError.extensions?.collection,
    field: nestedError.extensions?.field,
  };
}
