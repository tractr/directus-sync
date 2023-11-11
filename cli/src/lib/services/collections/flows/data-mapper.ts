import { DataMapper, Field, IdMappers } from '../base';
import { DirectusFlow } from '@directus/sdk';
import { Container, Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { FLOWS_COLLECTION } from './constants';
import { OperationsIdMapperClient } from '../operations';
import {LOGGER} from "../../../constants";

@Service()
export class FlowsDataMapper extends DataMapper<DirectusFlow<object>> {
  protected fieldsToIgnore: Field<DirectusFlow<object>>[] = [
    'date_created',
    'user_created',
    'operations',
  ];
  protected idMappers: IdMappers<DirectusFlow<object>> = {
    operation: Container.get(OperationsIdMapperClient),
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION));
  }
}
