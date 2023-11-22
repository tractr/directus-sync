import { ConfigService, getIdMapperClientByName } from '../services';
import { Container } from 'typedi';
import pino from 'pino';
import { LOGGER } from '../constants';

export async function runUntrack() {
  const logger: pino.Logger = Container.get(LOGGER);
  const config = Container.get(ConfigService);

  const { collection, id } = config.getUntrackConfig();
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
