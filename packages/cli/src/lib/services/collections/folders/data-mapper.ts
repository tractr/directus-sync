import { DataMapper, IdMappers } from '../base';

import { Container, Service } from 'typedi';
import { LoggerService } from '../../logger';
import { FOLDERS_COLLECTION } from './constants';
import { DirectusFolder } from './interfaces';
import { FoldersIdMapperClient } from './id-mapper-client';

@Service()
export class FoldersDataMapper extends DataMapper<DirectusFolder> {
  protected idMappers: IdMappers<DirectusFolder> = {
    parent: Container.get(FoldersIdMapperClient),
  };
  constructor(loggerService: LoggerService) {
    super(loggerService.getChild(FOLDERS_COLLECTION));
  }
}
