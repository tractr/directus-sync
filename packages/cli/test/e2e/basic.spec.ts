import {
  DirectusInstance,
  DirectusSync,
  getDumpedSystemCollectionsContents,
  getSetupTimeout,
} from './sdk';
import Path from 'path';
import { rmSync } from 'fs-extra';
import {
  createDashboard,
  createFlow,
  createFolder,
  createOperation,
  createPanel,
  createPermission,
  createRole,
  updateFlow,
} from '@directus/sdk';
import {
  getDashboard,
  getFlow,
  getFolder,
  getOperation,
  getPanel,
  getPermission,
  getRole,
} from './seed';

describe('Empty instance configs', () => {
  const dumpPath = Path.resolve(__dirname, 'dumps/basic');
  const instance = new DirectusInstance();
  const directus = instance.getDirectusClient();
  let sync: DirectusSync;

  beforeAll(async () => {
    rmSync(dumpPath, { recursive: true, force: true });
    await instance.start();
    await directus.loginAsAdmin();
    sync = new DirectusSync({
      token: await directus.requireToken(),
      url: directus.getUrl(),
      dumpPath: dumpPath,
    });
  }, getSetupTimeout());
  afterAll(() => {
    instance.stop();
  });

  it('should pull items from Directus', async () => {
    // --------------------------------------------------------------------
    // Create content using Directus SDK
    const client = directus.get();
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

    // --------------------------------------------------------------------
    // Update flow with operation
    await client.request(updateFlow(flow.id, { operation: operation.id }));

    // --------------------------------------------------------------------
    // Pull the content from Directus
    const output = await sync.pull();

    // --------------------------------------------------------------------
    // Check if the logs reports new content
    expect(output).toContain('[dashboards] Pulled 1 items');
    expect(output).toContain('[dashboards] Post-processed 1 items');
    expect(output).toContain('[flows] Pulled 1 items');
    expect(output).toContain('[flows] Post-processed 1 items');
    expect(output).toContain('[folders] Pulled 1 items');
    expect(output).toContain('[folders] Post-processed 1 items');
    expect(output).toContain('[operations] Pulled 1 items');
    expect(output).toContain('[operations] Post-processed 1 items');
    expect(output).toContain('[panels] Pulled 1 items');
    expect(output).toContain('[panels] Post-processed 1 items');
    expect(output).toContain('[roles] Pulled 1 items');
    expect(output).toContain('[roles] Post-processed 1 items');
    expect(output).toContain('[permissions] Pulled 1 items');
    expect(output).toContain('[permissions] Post-processed 1 items');

    // --------------------------------------------------------------------
    // Check created sync id
    expect((await directus.getSyncIdMaps('dashboards')).length).toBe(1);
    expect((await directus.getSyncIdMaps('flows')).length).toBe(1);
    expect((await directus.getSyncIdMaps('folders')).length).toBe(1);
    expect((await directus.getSyncIdMaps('operations')).length).toBe(1);
    expect((await directus.getSyncIdMaps('panels')).length).toBe(1);
    expect((await directus.getSyncIdMaps('roles')).length).toBe(1);
    expect((await directus.getSyncIdMaps('permissions')).length).toBe(1);

    // --------------------------------------------------------------------
    // Check if the content was dumped correctly
    const collections = getDumpedSystemCollectionsContents(dumpPath);
    expect(collections.dashboards).toEqual([
      {
        _syncId: (await directus.getByLocalId('dashboards', dashboard.id))
          .sync_id,
        name: dashboard.name,
        icon: dashboard.icon,
        note: dashboard.note,
        color: dashboard.color,
      },
    ]);
    expect(collections.flows).toEqual([
      {
        _syncId: (await directus.getByLocalId('flows', flow.id)).sync_id,
        name: flow.name,
        icon: flow.icon,
        color: flow.color,
        description: flow.description,
        status: flow.status,
        trigger: flow.trigger,
        accountability: flow.accountability,
        options: flow.options,
        operation: (await directus.getByLocalId('operations', operation.id))
          .sync_id,
      },
    ]);
    expect(collections.folders).toEqual([
      {
        _syncId: (await directus.getByLocalId('folders', folder.id)).sync_id,
        name: folder.name,
        parent: folder.parent,
      },
    ]);
    expect(collections.operations).toEqual([
      {
        _syncId: (await directus.getByLocalId('operations', operation.id))
          .sync_id,
        name: operation.name,
        key: operation.key,
        type: operation.type,
        position_x: operation.position_x,
        position_y: operation.position_y,
        options: operation.options,
        resolve: operation.resolve,
        reject: operation.reject,
        flow: operation.flow,
      },
    ]);
    expect(collections.panels).toEqual([
      {
        _syncId: (await directus.getByLocalId('panels', panel.id)).sync_id,
        dashboard: (await directus.getByLocalId('dashboards', dashboard.id))
          .sync_id,
        name: panel.name,
        icon: panel.icon,
        color: panel.color,
        show_header: panel.show_header,
        note: panel.note,
        type: panel.type,
        position_x: panel.position_x,
        position_y: panel.position_y,
        width: panel.width,
        height: panel.height,
        options: panel.options,
      },
    ]);
    expect(collections.roles).toEqual([
      {
        _syncId: (await directus.getByLocalId('roles', role.id)).sync_id,
        name: role.name,
        icon: role.icon,
        description: role.description,
        ip_access: role.ip_access,
        enforce_tfa: role.enforce_tfa,
        admin_access: role.admin_access,
        app_access: role.app_access,
      },
    ]);
    expect(collections.permissions).toEqual([
      {
        _syncId: (await directus.getByLocalId('permissions', permission.id))
          .sync_id,
        role: (await directus.getByLocalId('roles', role.id)).sync_id,
        collection: permission.collection,
        action: permission.action,
        permissions: permission.permissions,
        validation: permission.validation,
        presets: permission.presets,
        fields: permission.fields,
      },
    ]);
  });
});
