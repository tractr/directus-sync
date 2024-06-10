import { DataMapper, Field, IdMappers } from '../base';
import { Container, Inject, Service } from 'typedi';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import { DashboardsIdMapperClient } from '../dashboards';
import { LOGGER } from '../../../constants';
import { EXTENSIONS_COLLECTION } from './constants';
import { DirectusExtension } from './interfaces';

@Service()
export class ExtensionsDataMapper extends DataMapper<DirectusExtension> {
  protected fieldsToIgnore: Field<DirectusExtension>[] = [
    'date_created',
    'user_created',
  ];
  protected idMappers: IdMappers<DirectusExtension> = {
    dashboard: Container.get(DashboardsIdMapperClient),
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, EXTENSIONS_COLLECTION));
  }
}
