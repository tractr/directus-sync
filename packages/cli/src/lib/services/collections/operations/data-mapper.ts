import { DataMapper, Field, IdMappers } from '../base';
import { Container, Inject, Service } from 'typedi';
import { FlowsIdMapperClient } from '../flows';
import { OperationsIdMapperClient } from './id-mapper-client';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { OPERATIONS_COLLECTION } from './constants';
import { DirectusOperation } from './interfaces';

@Service()
export class OperationsDataMapper extends DataMapper<DirectusOperation> {
  protected fieldsToIgnore: Field<DirectusOperation>[] = [
    'date_created',
    'user_created',
  ];
  protected idMappers: IdMappers<DirectusOperation> = {
    flow: Container.get(FlowsIdMapperClient),
    resolve: Container.get(OperationsIdMapperClient),
    reject: Container.get(OperationsIdMapperClient),
    options: {
      flow: Container.get(FlowsIdMapperClient),
    },
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, OPERATIONS_COLLECTION));
  }
}
