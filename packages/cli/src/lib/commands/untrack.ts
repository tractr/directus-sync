import { getIdMapperClientByName } from '../services';
import { Container } from 'typedi';
import pino from 'pino';
import { LOGGER } from '../constants';

interface RunUntrackOptions {
  collection: string;
  id: string;
}

export async function runUntrack(options?: RunUntrackOptions) {
  const logger: pino.Logger = Container.get(LOGGER);
  if (!options) {
    throw new Error('Missing options');
  }
  const { collection, id } = options;
  const idMapper = getIdMapperClientByName(collection);
  try {
    await idMapper.removeByLocalId(id);
    logger.info(`Untracked ${collection} ${id}`);
  } catch (e) {
    logger.warn(
      `Failed to untrack ${collection} ${id}: ${(e as Error).message}`,
    );
  }
}
