import { DataMapper, Field, IdMappers } from '../base';
import { Container, Service } from 'typedi';
import { LoggerService } from '../../logger';
import { DashboardsIdMapperClient } from '../dashboards';
import { PANELS_COLLECTION } from './constants';
import { DirectusPanel } from './interfaces';

@Service()
export class PanelsDataMapper extends DataMapper<DirectusPanel> {
  protected fieldsToIgnore: Field<DirectusPanel>[] = [
    'date_created',
    'user_created',
  ];
  protected idMappers: IdMappers<DirectusPanel> = {
    dashboard: Container.get(DashboardsIdMapperClient),
  };

  constructor(loggerService: LoggerService) {
    super(loggerService.getChild(PANELS_COLLECTION));
  }
}
