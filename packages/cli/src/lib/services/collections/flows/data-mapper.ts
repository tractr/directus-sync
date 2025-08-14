import { DataMapper, Field, IdMappers } from '../base';
import { Container, Service } from 'typedi';
import { LoggerService } from '../../logger';
import { FLOWS_COLLECTION } from './constants';
import { OperationsIdMapperClient } from '../operations';
import { DirectusFlow } from './interfaces';

@Service()
export class FlowsDataMapper extends DataMapper<DirectusFlow> {
  protected fieldsToIgnore: Field<DirectusFlow, 'operations'>[] = [
    'date_created',
    'user_created',
    'operations',
  ];
  protected idMappers: IdMappers<DirectusFlow> = {
    operation: Container.get(OperationsIdMapperClient),
  };

  constructor(loggerService: LoggerService) {
    super(loggerService.getChild(FLOWS_COLLECTION));
  }
}
