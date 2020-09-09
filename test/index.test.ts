// eslint-disable-next-line node/no-unpublished-import
import tempy from 'tempy';
import {join} from 'path';
// eslint-disable-next-line node/no-unpublished-import
import yaml from 'yaml';
import {prepare} from '../src';
import {writeFileSync, readFileSync} from 'fs';

describe('prepare', () => {
  it('updates pubspec.yaml', async () => {
    expect.hasAssertions();
    const cwd = tempy.directory();
    const pubspecPath = join(cwd, 'pubspec.yaml');
    const pubspec = yaml.stringify({version: '1.0.0'});
    writeFileSync(pubspecPath, pubspec);
    const updatedVersion = '1.0.1';

    await prepare(
      {
        cwd,
      },
      {
        nextRelease: {
          version: updatedVersion,
          type: 'patch',
          notes: '',
          gitTag: '',
          gitHead: '',
        },
        logger: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          log: (message: string, ...vars: unknown[]) => {},
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          error: (_message: string, ..._vars: unknown[]) => {},
        },
        env: {},
      }
    );

    expect(yaml.parse(readFileSync(pubspecPath).toString())['version']).toBe(
      updatedVersion
    );
  });
});
