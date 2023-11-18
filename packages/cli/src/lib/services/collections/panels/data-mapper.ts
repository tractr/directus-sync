import {DataMapper, Field, IdMappers} from '../base';
import {Container, Inject, Service} from 'typedi';
import pino from 'pino';
import {getChildLogger} from '../../../helpers';
import {DashboardsIdMapperClient} from '../dashboards';
import {LOGGER} from '../../../constants';
import {PANELS_COLLECTION} from './constants';
import {DirectusPanel} from "./interfaces";

@Service()
export class PanelsDataMapper extends DataMapper<DirectusPanel> {
  protected fieldsToIgnore: Field<DirectusPanel>[] = [
    'date_created',
    'user_created',
  ];
  protected idMappers: IdMappers<DirectusPanel> = {
    dashboard: Container.get(DashboardsIdMapperClient),
  };

  constructor(@Inject(LOGGER) baseLogger: pino.Logger) {
    super(getChildLogger(baseLogger, PANELS_COLLECTION));
  }
}
