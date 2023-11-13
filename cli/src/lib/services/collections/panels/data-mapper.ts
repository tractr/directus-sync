import { DataMapper, Field, IdMappers } from '../base';
import { DirectusPanel } from '@directus/sdk';
import { Container, Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { DashboardsIdMapperClient } from '../dashboards';
import { LOGGER } from '../../../constants';
import { PANELS_COLLECTION } from './constants';

@Service()
export class PanelsDataMapper extends DataMapper<DirectusPanel<object>> {
  protected fieldsToIgnore: Field<DirectusPanel<object>>[] = [
    'date_created',
    'user_created',
  ];
  protected idMappers: IdMappers<DirectusPanel<object>> = {
    dashboard: Container.get(DashboardsIdMapperClient),
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, PANELS_COLLECTION));
  }
}
