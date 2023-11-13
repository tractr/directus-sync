import { DASHBOARDS_COLLECTION, DashboardsIdMapperClient } from './dashboards';
import { Container } from 'typedi';
import { FLOWS_COLLECTION, FlowsIdMapperClient } from './flows';
import { OPERATIONS_COLLECTION, OperationsIdMapperClient } from './operations';
import { SETTINGS_COLLECTION, SettingsIdMapperClient } from './settings';
import { WEBHOOKS_COLLECTION, WebhooksIdMapperClient } from './webhooks';
import { ROLES_COLLECTION, RolesIdMapperClient } from './roles';
import {
  PERMISSIONS_COLLECTION,
  PermissionsIdMapperClient,
} from './permissions';
import { PANELS_COLLECTION, PanelsIdMapperClient } from './panels';
import { IdMapperClient } from './base';

export function getIdMapperClientByName(collection: string) {
  let idMapper: IdMapperClient;
  switch (collection) {
    case DASHBOARDS_COLLECTION:
      idMapper = Container.get(DashboardsIdMapperClient);
      break;
    case FLOWS_COLLECTION:
      idMapper = Container.get(FlowsIdMapperClient);
      break;
    case OPERATIONS_COLLECTION:
      idMapper = Container.get(OperationsIdMapperClient);
      break;
    case PANELS_COLLECTION:
      idMapper = Container.get(PanelsIdMapperClient);
      break;
    case PERMISSIONS_COLLECTION:
      idMapper = Container.get(PermissionsIdMapperClient);
      break;
    case ROLES_COLLECTION:
      idMapper = Container.get(RolesIdMapperClient);
      break;
    case SETTINGS_COLLECTION:
      idMapper = Container.get(SettingsIdMapperClient);
      break;
    case WEBHOOKS_COLLECTION:
      idMapper = Container.get(WebhooksIdMapperClient);
      break;
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
  return idMapper;
}
