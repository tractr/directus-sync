import { DataMapper, Field, IdMappers } from '../base';
import { Service } from 'typedi';
import { LoggerService } from '../../logger';
import { DASHBOARDS_COLLECTION } from './constants';
import { DirectusDashboard } from './interfaces';

@Service()
export class DashboardsDataMapper extends DataMapper<DirectusDashboard> {
  protected fieldsToIgnore: Field<DirectusDashboard, 'panels'>[] = [
    'date_created',
    'user_created',
    'panels',
  ];
  protected idMappers: IdMappers<DirectusDashboard> = {};

  constructor(loggerService: LoggerService) {
    super(loggerService.getChild(DASHBOARDS_COLLECTION));
  }
}
