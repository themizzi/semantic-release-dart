import {Config, Context} from 'semantic-release';
import * as path from 'path';
import {writeFileSync, existsSync, readFileSync} from 'fs';
import {cwd} from 'process';

export async function prepare(pluginConfig: Config, context: Context) {
  const workingDir = pluginConfig.cwd ?? cwd();
  const pubSpecPath = path.resolve(workingDir, 'pubspec.yaml');

  if (!existsSync(pubSpecPath)) {
    throw Error(`pubspec.yaml not found in ${workingDir}`);
  }

  const pubSpec = readFileSync(pubSpecPath).toString();

  context.logger.log(
    'Write version %s to pubspec.yaml in %s',
    context.nextRelease?.version,
    workingDir
  );

  const regex = /^version: [0-9.+-]+(.*)/m;
  const updatedPubSpec = pubSpec.replace(
    regex,
    `version: ${context.nextRelease?.version}$1`
  );

  writeFileSync(pubSpecPath, updatedPubSpec);
}
