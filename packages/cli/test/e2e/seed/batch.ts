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
  createWebhook,
  deleteDashboards,
  deleteFlows,
  deleteFolders,
  deleteOperations,
  deletePanels,
  deletePermissions,
  deletePresets,
  deleteRoles,
  deleteTranslations,
  deleteWebhooks,
  DirectusClient,
  DirectusSettings,
  RestClient,
  updateFlow,
  updateSettings,
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
  getWebhook,
} from './collections';
import { DirectusSettingsExtra, SystemCollectionsRecordPartial } from '../sdk';
import { DirectusId } from '../../../src/lib';

export async function createOneItemInEachSystemCollection(
  client: DirectusClient<object> & RestClient<object>,
) {
  const dashboard = await client.request(createDashboard(getDashboard()));
  const flow = await client.request(createFlow(getFlow()));
  const folder = await client.request(createFolder(getFolder()));
  const operation = await client.request(
    createOperation(getOperation(flow.id)),
  );
  const panel = await client.request(createPanel(getPanel(dashboard.id)));
  const role = await client.request(createRole(getRole()));
  const permission = await client.request(
    createPermission(getPermission(role.id, 'dashboards', 'update')),
  );
  const preset = await client.request(createPreset(getPreset()));
  const settings = (await client.request(
    updateSettings(getSettings()),
  )) as never as DirectusSettings<object> & DirectusSettingsExtra;
  const translation = await client.request(createTranslation(getTranslation()));
  const webhook = await client.request(createWebhook(getWebhook()));

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
    webhook,
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
  if (ids.webhooks?.length) {
    await client.request(deleteWebhooks(ids.webhooks as number[]));
  }
  if (ids.translations?.length) {
    await client.request(deleteTranslations(ids.translations as string[]));
  }
}
