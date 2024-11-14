import { Context } from '../helpers/index.js';
import Path from 'path';
import Fs from 'fs-extra';

export const groupAndFieldNamesConflict = (context: Context) => {
  it('group and field with same name', async () => {
    // --------------------------------------------------------------------
    // Init sync client and push
    const syncInit = await context.getSync(
      'sources/group-and-field-names-conflict',
    );
    await syncInit.push();

    // Create another sync client and pull
    const sync = await context.getSync('temp/group-and-field-names-conflict');
    await sync.pull();

    // --------------------------------------------------------------------
    // Get the files names in the snapshot folder
    const dumpPath = sync.getDumpPath();
    const fieldsPath = Path.join(dumpPath, 'snapshot', 'fields', 'profile');
    const fieldsFiles = Fs.readdirSync(fieldsPath);

    // --------------------------------------------------------------------
    expect(fieldsFiles).toHaveSize(4);
    expect(fieldsFiles).toContain('id.json');
    expect(fieldsFiles).toContain('avatar_url.json');
    expect(fieldsFiles).toContain('content.json');
    expect(fieldsFiles).toContain('content_2.json');
  });
};
