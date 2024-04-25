import 'dotenv/config';
import './helpers/env.js';
import { Context } from './helpers/index.js';
import {
  pullAndPushWithoutData,
  pullAndPushWithoutChanges,
  preserveIds,
  pullBasic,
  pushFlushAndPush,
  pullWithNewData,
  pushOnEmptyInstance,
  pushTwiceOnEmptyInstance,
} from './pull-diff-push/index.js';
import { pushWithDependencies } from './dependencies/index.js';
import {
  onDump,
  onLoad,
  onQuery,
  onSave,
  onSaveDuplicate,
} from './hooks/index.js';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('Pull and check if ids are preserved for some collections', () => {
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
  pullAndPushWithoutData(context);
  pullBasic(context);
  pushFlushAndPush(context);
  pullWithNewData(context);
  pushOnEmptyInstance(context);
  pushTwiceOnEmptyInstance(context);

  pushWithDependencies(context);

  onDump(context);
  onSave(context);
  onSaveDuplicate(context);
  onLoad(context);
  onQuery(context);
});
