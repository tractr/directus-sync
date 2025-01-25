import 'dotenv/config';
import './helpers/env.js';
import { Context } from './helpers/index.js';
import {
  preserveIds,
  pullAndPushWithChanges,
  pullAndPushWithDeletions,
  pullAndPushWithoutChanges,
  pullAndPushWithoutData,
  pullBasic,
  pullWithNewData,
  pushFlushAndPush,
  pushOnEmptyInstance,
  pushTwiceOnEmptyInstance,
  pushWithExistingUuid,
} from './pull-diff-push/index.js';
import { pushWithDependencies } from './dependencies/index.js';
import {
  collectionsOnDump,
  collectionsOnLoad,
  collectionsOnQuery,
  collectionsOnSave,
  collectionsOnSaveDuplicate,
  snapshotOnLoad,
  snapshotOnSave,
} from './hooks/index.js';
import {
  excludeSomeCollections,
  includeSomeCollections,
  noSnapshot,
} from './exclude-include/index.js';
import {
  insertDuplicatedPermissions,
  pullAndPushPublicPermissions,
  removePermissionDuplicates,
} from './permissions/index.js';
import { removeTrackedItem } from './untrack/index.js';
import {
  createOperationsWithConflicts,
  updateOperationsWithConflicts,
} from './operations/index.js';
import { updateDefaultData } from './default-data/index.js';
import { configPathInfo } from './config/index.js';
import { groupAndFieldNamesConflict } from './snapshot/index.js';
import { seedPushOnEmptyInstance } from './seed/index.js';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('Tests entrypoint ->', () => {
  // ---------------------------------------------------
  // Global setup
  const context = new Context();
  beforeAll(async () => {
    await context.init();
  });
  afterAll(async () => {
    await context.dispose();
  });
  beforeEach(async () => {
    await context.setup();
  });
  afterEach(async () => {
    await context.teardown();
  });

  // ---------------------------------------------------
  // Tests
  preserveIds(context);
  pullAndPushWithoutChanges(context);
  pullAndPushWithChanges(context);
  pullAndPushWithDeletions(context);
  pullAndPushWithoutData(context);
  pullBasic(context);
  pushFlushAndPush(context);
  pullWithNewData(context);
  pushOnEmptyInstance(context);
  pushTwiceOnEmptyInstance(context);
  pushWithExistingUuid(context);

  updateDefaultData(context);

  pushWithDependencies(context);

  updateOperationsWithConflicts(context);
  createOperationsWithConflicts(context);

  collectionsOnDump(context);
  collectionsOnSave(context);
  collectionsOnSaveDuplicate(context);
  collectionsOnLoad(context);
  collectionsOnQuery(context);

  snapshotOnLoad(context);
  snapshotOnSave(context);

  excludeSomeCollections(context);
  includeSomeCollections(context);
  noSnapshot(context);

  configPathInfo(context);

  insertDuplicatedPermissions(context);
  removePermissionDuplicates(context);
  pullAndPushPublicPermissions(context);

  groupAndFieldNamesConflict(context);

  removeTrackedItem(context);

  seedPushOnEmptyInstance(context);
});
