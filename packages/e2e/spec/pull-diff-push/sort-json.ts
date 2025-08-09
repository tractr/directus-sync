import { Context } from '../helpers/index.js';
import fs from 'fs-extra';
import Path from 'path';

describe('Pull with --sort-json produces sorted snapshot JSON files', () => {
  const ctx = new Context();

  beforeAll(async () => {
    await ctx.init();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  beforeEach(async () => {
    await ctx.setup();
  });

  afterEach(async () => {
    await ctx.teardown();
  });

  it('should sort keys in snapshot files when --sort-json is passed', async () => {
    const sync = await ctx.getSync('temp/sort-json');

    // Run pull with sorting enabled
    await sync.pull(['--sort-json']);

    const dumpPath = sync.getDumpPath();
    const snapshotDir = Path.resolve(dumpPath, 'snapshot');

    // Collect all snapshot JSON files (including split files)
    const files: string[] = [];
    function walk(dir: string) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir)) {
        const p = Path.join(dir, entry);
        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
          walk(p);
        } else if (entry.endsWith('.json')) {
          files.push(p);
        }
      }
    }
    walk(snapshotDir);

    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const content = fs.readJSONSync(file);
      // Validate top-level object keys are sorted
      if (content && typeof content === 'object' && !Array.isArray(content)) {
        const keys = Object.keys(content);
        const sorted = [...keys].sort((a, b) => a.localeCompare(b));
        expect(keys).toEqual(sorted);
      }
    }
  });
});


