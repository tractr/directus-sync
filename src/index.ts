import { defineEndpoint } from '@directus/extensions-sdk';
import { IdMapper } from './database/id-mapper';

export default defineEndpoint(async (router, { database }) => {
  const idMapper = new IdMapper(database);
  await idMapper.init();

  router.get('/table/{table}/sync_id/{sync_id}', async (req, res) => {
    const { table, sync_id } = req.params as { table: string; sync_id: string };
    const local_id = await idMapper.getLocalId(table, sync_id);
    res.send({ local_id });
  });
  router.get('/', (_req, res) => res.send('Hello, World!'));
});
