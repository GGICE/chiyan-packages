import path from 'path';
import fs from 'fs-extra';
import { readeJSONFile } from './utils';
import { PROJECT_INIT_CONFIG_FILE_PATH } from './config';
import type { Config } from './common';

export const runHook = async (projectPath: string, hook: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { run } = require(path.join(projectPath, hook));
    await run(projectPath);
    fs.rmSync(path.join(projectPath, hook) + '.js');
  } catch (e) {}
};

export const getProjectInitConfig = (projectPath: string): null | Config => {
  try {
    return readeJSONFile(path.join(projectPath, PROJECT_INIT_CONFIG_FILE_PATH, 'config.json')) as any;
  } catch (e) {
    return null;
  }
};
