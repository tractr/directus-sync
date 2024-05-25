import {
  createDashboard,
  createFlow,
  createFolder,
  createOperation,
  createPanel,
  createPermission,
  createPreset,
  createRole,
  createTranslation,
  deleteDashboards,
  deleteFlows,
  deleteFolders,
  deleteOperations,
  deletePanels,
  deletePermissions,
  deletePresets,
  deleteRoles,
  deleteTranslations,
  DirectusClient,
  DirectusSettings,
  readDashboards,
  readFlows,
  readFolders,
  readOperations,
  readPanels,
  readPermissions,
  readPresets,
  readRoles,
  readSettings,
  readTranslations,
  RestClient,
  updateFlow,
  updateSettings,
  readCollections,
  readFields,
  readRelations,
} from '@directus/sdk';
import {
  getDashboard,
  getFlow,
  getFolder,
  getOperation,
  getPanel,
  getPermission,
  getPreset,
  getRole,
  getSettings,
  getTranslation,
} from '../seed/index.js';
import {
  DirectusId,
  DirectusSettingsExtra,
  notAdministratorRoles,
  notNullId,
  notSystemPermissions,
  SystemCollectionsPartial,
  SystemCollectionsRecordPartial,
} from '../sdk/index.js';

export type SingularCollectionName = keyof Awaited<ReturnType<typeof createOneItemInEachSystemCollection>>;
export async function createOneItemInEachSystemCollection(
  client: DirectusClient<object> & RestClient<object>,
  override?: SystemCollectionsPartial,
) {
  const dashboard = await client.request(
    createDashboard({ ...getDashboard(), ...override?.dashboards }),
  );

  const flow = await client.request(
    createFlow({ ...getFlow(), ...override?.flows }),
  );
  const folder = await client.request(
    createFolder({ ...getFolder(), ...override?.folders }),
  );
  const operation = await client.request(
    createOperation({ ...getOperation(flow.id), ...override?.operations }),
  );
  const panel = await client.request(
    createPanel({ ...getPanel(dashboard.id), ...override?.panels }),
  );
  const role = await client.request(
    createRole({ ...getRole(), ...override?.roles }),
  );
  const permission = await client.request(
    createPermission({
      ...getPermission(role.id, 'dashboards', 'update'),
      ...override?.permissions,
    }),
  );
  const preset = await client.request(
    createPreset({ ...getPreset(), ...override?.presets }),
  );
  const settings = (await client.request(
    updateSettings({ ...getSettings(role.id), ...override?.settings }),
  )) as never as DirectusSettings<object> & DirectusSettingsExtra;
  const translation = await client.request(
    createTranslation({ ...getTranslation(), ...override?.translations }),
  );

  // --------------------------------------------------------------------
  // Update flow with operation
  await client.request(updateFlow(flow.id, { operation: operation.id }));

  return {
    dashboard,
    flow,
    folder,
    operation,
    panel,
    role,
    permission,
    preset,
    settings,
    translation,
  };
}

export async function deleteItemsFromSystemCollections(
  client: DirectusClient<object> & RestClient<object>,
  ids: SystemCollectionsRecordPartial<DirectusId[]>,
) {
  if (ids.panels?.length) {
    await client.request(deletePanels(ids.panels as string[]));
  }
  if (ids.dashboards?.length) {
    await client.request(deleteDashboards(ids.dashboards as string[]));
  }
  if (ids.operations?.length) {
    await client.request(deleteOperations(ids.operations as string[]));
  }
  if (ids.flows?.length) {
    await client.request(deleteFlows(ids.flows as string[]));
  }
  if (ids.folders?.length) {
    await client.request(deleteFolders(ids.folders as string[]));
  }
  if (ids.permissions?.length) {
    await client.request(deletePermissions(ids.permissions as number[]));
  }
  if (ids.roles?.length) {
    await client.request(deleteRoles(ids.roles as string[]));
  }
  if (ids.presets?.length) {
    await client.request(deletePresets(ids.presets as number[]));
  }
  if (ids.translations?.length) {
    await client.request(deleteTranslations(ids.translations as string[]));
  }
}

export async function readAllSystemCollections(
  client: DirectusClient<object> & RestClient<object>,
) {
  return {
    dashboards: await client.request(readDashboards()),
    flows: await client.request(readFlows()),
    folders: await client.request(readFolders()),
    operations: await client.request(readOperations()),
    panels: await client.request(readPanels()),
    permissions: (await client.request(readPermissions())).filter(
      notSystemPermissions,
    ),
    presets: await client.request(readPresets()),
    roles: (await client.request(readRoles())).filter(notAdministratorRoles),
    settings: [await client.request(readSettings())].filter(notNullId),
    translations: await client.request(readTranslations()),
  };
}

export async function readAllCollectionsFieldsAndRelations(
  client: DirectusClient<object> & RestClient<object>,
) {
  return {
    collections: await client.request(readCollections()),
    fields: await client.request(readFields()),
    relations: await client.request(readRelations()),
  };
}
