import { readFiles, readFolders, readUsers } from '@directus/sdk';
import { Context, debug, info } from '../helpers/index.js';

export const seedFiles = (context: Context) => {
  it('seed push for directus_files and verify links to folder and user', async () => {
    // Init sync client
    const sync = await context.getSync('sources/seed-files');
    const directus = context.getDirectus();
    const client = directus.get();

    // Push schema first
    await sync.push();

    // Check differences for seeds (optional sanity)
    const diffOutput = await sync.seedDiff();
    expect(diffOutput).toContain(info('[directus_files] To create: 2 item(s)'));
    expect(diffOutput).toContain(
      debug('[directus_files] To update: 0 item(s)'),
    );
    expect(diffOutput).toContain(
      debug('[directus_files] To delete: 0 item(s)'),
    );

    // Push data seeds to Directus
    const beforePushDate = new Date();
    const pushOutput = await sync.seedPush();

    // Analyze output
    expect(pushOutput).toContain(info('[directus_files] Created 2 items'));
    expect(pushOutput).toContain(debug('[directus_files] Updated 0 items'));
    expect(pushOutput).toContain(debug('[directus_files] Deleted 0 items'));

    // Check that activities have been created
    const activities = await directus.getActivities(beforePushDate);
    const createdFiles = activities.filter(
      (a) => a.action === 'create' && a.collection === 'directus_files',
    );
    expect(createdFiles.length).toEqual(2);

    // Fetch folders, users and files
    const folders = await client.request(readFolders());
    const users = await client.request(readUsers());
    const files = await client.request(readFiles());

    // Expect two files
    expect(files.length).toEqual(2);

    // Resolve linked folder and user
    const folder = folders.find((f) => f.name === 'derideo vulticulus');
    expect(folder).toBeDefined();

    const john = users.find((u) => u.email === 'john.doe@example.com');
    expect(john).toBeDefined();

    // Find first file (by unique filename/title) and assert links
    const file1 = files.find((f) => f.filename_download === 'the-file-1.jpg');
    expect(file1).toBeDefined();
    expect(file1?.folder).toEqual(folder?.id);
    expect(file1?.uploaded_by).toEqual(john?.id);
  });
};
