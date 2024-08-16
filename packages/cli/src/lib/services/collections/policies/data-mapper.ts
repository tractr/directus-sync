import { DataMapper, Field, IdMappers } from '../base';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { POLICIES_COLLECTION } from './constants';
import { DirectusPolicy } from './interfaces';

@Service()
export class PoliciesDataMapper extends DataMapper<DirectusPolicy> {
  protected fieldsToIgnore: Field<DirectusPolicy>[] = [];
  protected idMappers: IdMappers<DirectusPolicy> = {};

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, POLICIES_COLLECTION));
  }
}
