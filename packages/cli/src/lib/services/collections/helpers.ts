import { Container } from 'typedi';
import { IdMapperClient } from './base';
import { DASHBOARDS_COLLECTION, DashboardsIdMapperClient } from './dashboards';
import { FLOWS_COLLECTION, FlowsIdMapperClient } from './flows';
import { OPERATIONS_COLLECTION, OperationsIdMapperClient } from './operations';
import { SETTINGS_COLLECTION, SettingsIdMapperClient } from './settings';
import { ROLES_COLLECTION, RolesIdMapperClient } from './roles';
import {
  PERMISSIONS_COLLECTION,
  PermissionsIdMapperClient,
} from './permissions';
import { PANELS_COLLECTION, PanelsIdMapperClient } from './panels';
import { FOLDERS_COLLECTION, FoldersIdMapperClient } from './folders';
import { PRESETS_COLLECTION, PresetsIdMapperClient } from './presets';
import {
  TRANSLATIONS_COLLECTION,
  TranslationsIdMapperClient,
} from './translations';
import { POLICIES_COLLECTION, PoliciesIdMapperClient } from './policies';

export function getIdMapperClientByName(collection: string) {
  let idMapper: IdMapperClient;
  switch (collection) {
    case DASHBOARDS_COLLECTION:
      idMapper = Container.get(DashboardsIdMapperClient);
      break;
    case FLOWS_COLLECTION:
      idMapper = Container.get(FlowsIdMapperClient);
      break;
    case FOLDERS_COLLECTION:
      idMapper = Container.get(FoldersIdMapperClient);
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
    case POLICIES_COLLECTION:
      idMapper = Container.get(PoliciesIdMapperClient);
      break;
    case PRESETS_COLLECTION:
      idMapper = Container.get(PresetsIdMapperClient);
      break;
    case ROLES_COLLECTION:
      idMapper = Container.get(RolesIdMapperClient);
      break;
    case SETTINGS_COLLECTION:
      idMapper = Container.get(SettingsIdMapperClient);
      break;
    case TRANSLATIONS_COLLECTION:
      idMapper = Container.get(TranslationsIdMapperClient);
      break;
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
  return idMapper;
}
