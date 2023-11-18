import { defineEndpoint } from '@directus/extensions-sdk';
import { IdMapper } from './database/id-mapper';
import { z } from 'zod';
import {
  ensureIsAdminHandler,
  errorHandler,
  logError,
  validateInput,
} from './api';
import createError from 'http-errors';

export default defineEndpoint(async (router, { database, logger }) => {
  const idMapper = new IdMapper(database);
  const created = await idMapper.init();

  if (created) {
    logger.info(`Created table ${idMapper.getTableName()}`);
  }

  router.use(ensureIsAdminHandler);

  router.get('/table/:table/sync_id/:sync_id', async (req, res, next) => {
    try {
      const { table, sync_id } = validateInput(
        req.params,
        z.object({ table: z.string(), sync_id: z.string() }),
      );
      const idMap = await idMapper.getBySyncId(table, sync_id);
      if (idMap === null) {
        return next(createError(404, 'No id map found'));
      }
      res.status(200);
      res.json(idMap);
    } catch (e) {
      next(e);
    }
  });

  router.get('/table/:table/local_id/:local_id', async (req, res, next) => {
    try {
      const { table, local_id } = validateInput(
        req.params,
        z.object({ table: z.string(), local_id: z.string() }),
      );
      const idMap = await idMapper.getByLocalId(table, local_id);
      if (idMap === null) {
        return next(createError(404, 'No id map found'));
      }
      res.status(200);
      res.json(idMap);
    } catch (e) {
      next(e);
    }
  });

  router.get('/table/:table', async (req, res, next) => {
    try {
      const { table } = validateInput(
        req.params,
        z.object({ table: z.string() }),
      );
      const idMaps = await idMapper.getAll(table);
      res.status(200);
      res.json(idMaps);
    } catch (e) {
      next(e);
    }
  });

  router.post('/table/:table', async (req, res, next) => {
    try {
      const { table, local_id, sync_id } = validateInput(
        { ...req.params, ...req.body },
        z.object({
          table: z.string(),
          local_id: z.string().or(z.number()),
          sync_id: z.string().optional(),
        }),
      );
      // Check if the local id exists
      const existing = await idMapper.getByLocalId(table, local_id);
      if (existing !== null) {
        return next(createError(409, 'Local id already exists'));
      }
      const final_sync_id = await idMapper.add(table, local_id, sync_id);
      res.json({ sync_id: final_sync_id });
      res.status(201);
    } catch (e) {
      next(e);
    }
  });

  router.delete('/table/:table/sync_id/:sync_id', async (req, res, next) => {
    try {
      const { table, sync_id } = validateInput(
        req.params,
        z.object({ table: z.string(), sync_id: z.string() }),
      );
      await idMapper.removeBySyncId(table, sync_id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  });

  router.delete('/table/:table/local_id/:local_id', async (req, res, next) => {
    try {
      const { table, local_id } = validateInput(
        req.params,
        z.object({ table: z.string(), local_id: z.string() }),
      );
      await idMapper.removeByLocalId(table, local_id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  });

  router.use(logError(logger));
  router.use(errorHandler);
});
