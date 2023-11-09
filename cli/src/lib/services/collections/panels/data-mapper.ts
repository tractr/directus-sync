import { DataMapper, Field, IdMappers, StrictField } from '../base';
import { DirectusPanel } from '@directus/sdk';
import { Container, Inject, Service } from 'typedi';
import { MigrationClient } from '../../migration-client';
import { FLOWS_COLLECTION } from '../flows';
import pino from 'pino';
import { getChildLogger } from '../../../helpers';
import {DashboardsIdMapperClient} from "../dashboards";

@Service()
export class PanelsDataMapper extends DataMapper<
  DirectusPanel<object>
> {
  protected usersFields: StrictField<DirectusPanel<object>>[] = [];
  protected fieldsToIgnore: Field<DirectusPanel<object>>[] = [
    'date_created',
    'user_created',
  ];
  protected idMappers: IdMappers<DirectusPanel<object>> = {
    dashboard: Container.get(DashboardsIdMapperClient),
  };

  constructor(
    @Inject('logger') baseLogger: pino.Logger,
    migrationClient: MigrationClient,
  ) {
    super(getChildLogger(baseLogger, FLOWS_COLLECTION), migrationClient);
  }
}
