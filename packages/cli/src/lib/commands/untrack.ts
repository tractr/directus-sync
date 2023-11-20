import { getIdMapperClientByName } from '../services';
import { Container } from 'typedi';
import { LOGGER } from '../constants';
import pino from 'pino';

export async function runUntrack({
  collection,
  id,
}: {
  collection: string;
  id: string;
}) {
  const logger = Container.get(LOGGER) ;
  const idMapper = getIdMapperClientByName(collection);
  try {
    await idMapper.removeByLocalId(id);
    logger.info(`Untracked ${collection} ${id}`);
  } catch (e) {
    logger.warn(`Failed to untrack ${collection} ${id}: ${e}`);
  }
}
