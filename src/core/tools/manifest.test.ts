import fs from 'node:fs';
import path from 'node:path';
import { allToolFiles } from './manifest';

const dir = path.resolve(__dirname, '../../../public/tools');

describe('tools manifest', () => {
  it('lists every file in public/tools, and only files that exist', () => {
    const onDisk = fs.readdirSync(dir).sort();
    expect(allToolFiles().sort()).toEqual(onDisk);
  });
});
