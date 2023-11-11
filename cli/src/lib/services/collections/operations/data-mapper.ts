import { DataMapper, Field, IdMappers } from '../base';
import { DirectusOperation } from '@directus/sdk';
import { Container, Inject, Service } from 'typedi';
import { FLOWS_COLLECTION, FlowsIdMapperClient } from '../flows';
import { OperationsIdMapperClient } from './id-mapper-client';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';

@Service()
export class OperationsDataMapper extends DataMapper<
  DirectusOperation<object>
> {
  protected fieldsToIgnore: Field<DirectusOperation<object>>[] = [
    'date_created',
    'user_created',
  ];
  protected idMappers: IdMappers<DirectusOperation<object>> = {
    flow: Container.get(FlowsIdMapperClient),
    resolve: Container.get(OperationsIdMapperClient),
    reject: Container.get(OperationsIdMapperClient),
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION));
  }
}
