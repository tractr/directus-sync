import { DataMapper, Field, IdMappers } from '../base';
import { DirectusDashboard } from '@directus/sdk';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { DASHBOARDS_COLLECTION } from './constants';

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

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, DASHBOARDS_COLLECTION));
  }
}
