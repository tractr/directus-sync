import { Context, debug } from '../helpers/index.js';

export const prettyDiffOutput = (context: Context) => {
  it('shows raw diff by default and pretty diff when --pretty-diff is enabled', async () => {
    // Use a dump that contains schema changes compared to a fresh instance
    const sync = await context.getSync('sources/snapshot-with-custom-model');

    // Default diff (pretty off)
    const defaultDiff = await sync.diff();
    // It should contain the raw JSON debug header and not the pretty header
    expect(defaultDiff).toContain(debug('[snapshot] Diff'));
    expect(
      defaultDiff.filter((l) =>
        l.msg.includes('The following changes will be applied:'),
      ).length,
    ).toBe(0);

    // Pretty diff enabled
    const pretty = await sync.diff(['--pretty-diff']);
    // It should contain the pretty header and not the raw JSON debug header
    expect(
      pretty.filter((l) =>
        l.msg.includes('The following changes will be applied:'),
      ).length,
    ).toBeGreaterThan(0);
    expect(pretty).not.toContain(debug('[snapshot] Diff'));
  });
};
