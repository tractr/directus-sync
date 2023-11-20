import { DataMapper, Field, IdMappers } from '../base';
import { Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { LOGGER } from '../../../constants';
import { DASHBOARDS_COLLECTION } from './constants';
import {
  DirectusDashboard,
  DirectusDashboardVirtualFields,
} from './interfaces';

@Service()
export class DashboardsDataMapper extends DataMapper<DirectusDashboard> {
  protected fieldsToIgnore: Field<
    DirectusDashboard,
    DirectusDashboardVirtualFields
  >[] = ['date_created', 'user_created', 'panels'];
  protected idMappers: IdMappers<DirectusDashboard> = {};

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, DASHBOARDS_COLLECTION));
  }
}
