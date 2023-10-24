import { createError } from '@directus/errors';
import { ZodSchema } from 'zod';

/**
 * Helpers to ensure the user is an admin
 */
export function ensureIsAdmin(req: any) {
  const { accountability } = req;
  if (accountability?.user == null) {
    throw createError(
      'Unauthorized',
      'You must be logged in to access this.',
      401,
    );
  }
  if (!accountability.admin) {
    throw createError(
      'Forbidden',
      'You do not have permission to access this.',
      403,
    );
  }
}

/**
 * Extract params from a request and
 */
export function validateInput<T extends ZodSchema>(
  params: Record<string, any>,
  zodSchema: T,
): Zod.infer<T> {
  try {
    return zodSchema.parse(params);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw createError('Bad Request', message, 400);
  }
}
