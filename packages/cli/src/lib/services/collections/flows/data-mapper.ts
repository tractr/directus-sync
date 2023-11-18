import {DataMapper, Field, IdMappers} from '../base';
import {Container, Inject, Service} from 'typedi';
import pino from 'pino';
import {getChildLogger} from '../../../helpers';
import {FLOWS_COLLECTION} from './constants';
import {OperationsIdMapperClient} from '../operations';
import {LOGGER} from '../../../constants';
import {DirectusFlow} from "./interfaces";

@Service()
export class FlowsDataMapper extends DataMapper<DirectusFlow> {
  protected fieldsToIgnore: Field<DirectusFlow>[] = [
    'date_created',
    'user_created',
    'operations',
  ];
  protected idMappers: IdMappers<DirectusFlow> = {
    operation: Container.get(OperationsIdMapperClient),
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION));
  }
}
