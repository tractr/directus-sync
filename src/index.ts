import { defineEndpoint } from '@directus/extensions-sdk';
import { IdMapper } from './database/id-mapper';

export default defineEndpoint(
  async (router, { database, services, logger }) => {
    const idMapper = new IdMapper(database);
    const created = await idMapper.init();
    if (created) {
      logger.info(`Created table ${idMapper.getTableName()}`);
    }

    router.get('/table/{table}/sync_id/{sync_id}', async (req, res, next) => {
      ensureIsAdmin(req, res);
      try {
        const local_id = await idMapper.getLocalId(
            req.params.table,
            req.params.sync_id,
        );
        res.status(200);
        res.send({ local_id });
      } catch (e) {
        res.status(404);
        res.send({ error: e.message });
      }
    });

    router.get('/table/{table}/local_id/{local_id}', async (req, res, next) => {
      ensureIsAdmin(req, res);
      try {
      const sync_id = await idMapper.getSyncId(
        req.params.table,
        req.params.local_id,
      );
      res.status(200);
      res.send({ sync_id });
      } catch (e) {
        res.status(404);
        res.send({ error: e.message });
      }
    });

    router.post('/', async (req, res, next) => {
      ensureIsAdmin(req, res);
      const { table, sync_id, local_id } = req.body;
      await idMapper.add(table, sync_id, local_id);
      res.status(201);
    });

    router.delete(
      '/table/{table}/sync_id/{sync_id}',
      async (req, res, next) => {
        ensureIsAdmin(req, res);
        await idMapper.removeBySyncId(req.params.table, req.params.sync_id);
        res.status(204);
      },
    );

    router.delete(
      '/table/{table}/local_id/{local_id}',
      async (req, res, next) => {
        ensureIsAdmin(req, res);
        await idMapper.removeByLocalId(req.params.table, req.params.local_id);
        res.status(204);
      },
    );
  },
);

/**
 * Helpers to ensure the user is an admin
 */
function ensureIsAdmin(req: any, res: any) {
  const { accountability } = req;
  if (accountability?.user == null) {
    res.status(401);
    res.send(`You don't have permission to access this.`);
    return false;
  }
  if (!accountability.admin) {
    res.status(403);
    res.send(`You don't have permission to access this.`);
    return false;
  }
  return true;
}
