import { defineEndpoint } from '@directus/extensions-sdk';
import { IdMapper } from './database/id-mapper';
import { z } from 'zod';
import {
  ensureIsAdminHandler,
  errorHandler,
  logError,
  validateInput,
} from './api';
import { Request, Response } from 'express-serve-static-core';

type Req = Request;
type Res = Response;

export default defineEndpoint(async (router, { database, logger }) => {
  const idMapper = new IdMapper(database);
  const created = await idMapper.init();
  if (created) {
    logger.info(`Created table ${idMapper.getTableName()}`);
  }

  router.use(ensureIsAdminHandler);
  router.use(logError(logger));
  router.use(errorHandler);

  router.get('/table/:table/sync_id/:sync_id', [
    async (req: Req, res: Res) => {
      const { table, sync_id } = validateInput(
        req.params,
        z.object({ table: z.string(), sync_id: z.string() }),
      );
      const local_id = await idMapper.getLocalId(table, sync_id);
      res.status(200);
      res.json({ local_id });
    },
  ]);
  //
  // router.get('/table/:table/local_id/:local_id', async (req, res) => {
  //   ensureIsAdmin(req);
  //   const { table, local_id } = validateInput(
  //     req.params,
  //     z.object({ table: z.string(), local_id: z.string() }),
  //   );
  //   const sync_id = await idMapper.getSyncId(table, local_id);
  //   res.status(200);
  //   res.json({ sync_id });
  // });
  //
  // router.post('/', async (req, res) => {
  //   ensureIsAdmin(req);
  //   const { table, local_id } = validateInput(
  //     req.body,
  //     z.object({ table: z.string(), local_id: z.string() }),
  //   );
  //   const sync_id = await idMapper.add(table, local_id);
  //   res.json({ sync_id });
  //   res.status(201);
  // });
  //
  // router.delete('/table/:table/sync_id/:sync_id', async (req, res) => {
  //   ensureIsAdmin(req);
  //   const { table, sync_id } = validateInput(
  //     req.params,
  //     z.object({ table: z.string(), sync_id: z.string() }),
  //   );
  //   await idMapper.removeBySyncId(table, sync_id);
  //   res.status(204);
  // });
  //
  // router.delete('/table/:table/local_id/:local_id', async (req, res) => {
  //   ensureIsAdmin(req);
  //   const { table, local_id } = validateInput(
  //     req.params,
  //     z.object({ table: z.string(), local_id: z.string() }),
  //   );
  //   await idMapper.removeByLocalId(table, local_id);
  //   res.status(204);
  // });
});
