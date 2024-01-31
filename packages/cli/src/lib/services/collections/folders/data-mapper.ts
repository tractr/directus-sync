import { DataMapper, IdMappers } from '../base';

import { Container, Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { FOLDERS_COLLECTION } from './constants';
import { DirectusFolder } from './interfaces';
import { FoldersIdMapperClient } from './id-mapper-client';

@Service()
export class FoldersDataMapper extends DataMapper<DirectusFolder> {
  protected idMappers: IdMappers<DirectusFolder> = {
    parent: Container.get(FoldersIdMapperClient),
  };
  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, FOLDERS_COLLECTION));
  }
}
