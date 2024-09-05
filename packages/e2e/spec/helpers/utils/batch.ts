import {
  createDashboard,
  createFlow,
  createFolder,
  createOperation,
  createPanel,
  createPermission,
  createPolicy,
  createPreset,
  createRole,
  createTranslation,
  deleteDashboards,
  deleteFlows,
  deleteFolders,
  deleteOperations,
  deletePanels,
  deletePermissions,
  deletePolicies,
  deletePresets,
  deleteRoles,
  deleteTranslations,
  DirectusClient,
  DirectusPermission,
  DirectusPolicy,
  DirectusSettings,
  Query,
  readCollections,
  readDashboards,
  readFields,
  readFlows,
  readFolders,
  readOperations,
  readPanels,
  readPermissions,
  readPolicies,
  readPresets,
  readRelations,
  readRoles,
  readSettings,
  readTranslations,
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
  getPolicy,
  getPreset,
  getRole,
  getSettings,
  getTranslation,
} from '../seed/index.js';
import {
  DirectusId,
  DirectusSettingsExtra,
  FixPermission,
  FixPolicy,
  notDefaultPolicies,
  notDefaultRoles,
  notNullId,
  notSystemPermissions,
  Schema,
  SystemCollectionsPartial,
  SystemCollectionsRecordPartial,
} from '../sdk/index.js';

export type SingularCollectionName = keyof Awaited<
  ReturnType<typeof createOneItemInEachSystemCollection>
>;
export async function createOneItemInEachSystemCollection(
  client: DirectusClient<Schema> & RestClient<Schema>,
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

  // --------------------------------------------------------
  // Create and fetch policy in order to include deep fields
  const policyRaw = await client.request(
    createPolicy({
      ...getPolicy(role.id),
      ...override?.policies,
      // Todo: remove this once it is fixed in the SDK
    } as unknown as DirectusPolicy<Schema>),
  );
  const [policy] = (await client.request(
    readPolicies({
      filter: { id: policyRaw.id },
      fields: ['*', 'roles.role', 'roles.sort'],
      // Todo: remove this once it is fixed in the SDK
    } as Query<Schema, DirectusPolicy<Schema>>),
  )) as unknown as FixPolicy<DirectusPolicy<Schema>>[];
  if (!policy) {
    throw new Error('Policy not found');
  }
  // --------------------------------------------------------

  const permission = await client.request(
    createPermission({
      ...getPermission(policy.id, 'dashboards', 'update'),
      ...override?.permissions,
    }),
  );
  const preset = await client.request(
    createPreset({ ...getPreset(), ...override?.presets }),
  );
  const settings = (await client.request(
    updateSettings({ ...getSettings(role.id), ...override?.settings }),
  )) as never as DirectusSettings<Schema> & DirectusSettingsExtra;
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
    policy,
    permission,
    preset,
    settings,
    translation,
  };
}

export async function deleteItemsFromSystemCollections(
  client: DirectusClient<Schema> & RestClient<Schema>,
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
  if (ids.policies?.length) {
    await client.request(deletePolicies(ids.policies as string[]));
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
  client: DirectusClient<Schema> & RestClient<Schema>,
  keepDefault = false,
) {
  const roles = await client.request(readRoles());

  const policies = (await client.request(
    readPolicies({
      fields: ['*', 'roles.role', 'roles.sort'],
      // Todo: remove this once it is fixed in the SDK
    } as Query<Schema, DirectusPolicy<Schema>>),
  )) as unknown as FixPolicy<DirectusPolicy<Schema>>[];

  const permissions = (await client.request(
    readPermissions(),
  )) as unknown as FixPermission<DirectusPermission<Schema>>[];

  return {
    dashboards: await client.request(readDashboards()),
    flows: await client.request(readFlows()),
    folders: await client.request(readFolders()),
    operations: await client.request(readOperations()),
    panels: await client.request(readPanels()),
    permissions: permissions.filter(notSystemPermissions),
    policies: keepDefault ? policies : policies.filter(notDefaultPolicies),
    presets: await client.request(readPresets()),
    roles: keepDefault ? roles : roles.filter(notDefaultRoles),
    settings: [await client.request(readSettings())].filter(notNullId),
    translations: await client.request(readTranslations()),
  };
}

export async function readAllCollectionsFieldsAndRelations(
  client: DirectusClient<Schema> & RestClient<Schema>,
) {
  return {
    collections: await client.request(readCollections()),
    fields: await client.request(readFields()),
    relations: await client.request(readRelations()),
  };
}
