import { DataMapper, Field, IdMappers } from '../base';
import { DirectusDashboard } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import { FLOWS_COLLECTION } from '../flows';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';

@Service()
export class DashboardsDataMapper extends DataMapper<
  DirectusDashboard<object>
> {
  protected fieldsToIgnore: Field<DirectusDashboard<object>>[] = [
    'date_created',
    'user_created',
    'panels',
  ];
  protected idMappers: IdMappers<DirectusDashboard<object>> = {};

  constructor(@Inject('logger') baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION));
  }
}
