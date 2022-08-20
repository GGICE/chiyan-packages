import path from 'path';
import merge from 'merge';
import fse from 'fs-extra';
import { downloadByGit, readeJSONFile, writeJSONFile } from './utils';
import { getProjectInitConfig } from './task-help';

import type { TaskOptions, Config } from './common';

const handleList: ((configs: Config, options: TaskOptions) => Promise<any>)[] = [
  async function mergePackageJson(configs, options) {
    const { templateProjectPath, projectPath } = options;
    const packageJsonPath = path.join(projectPath!, 'package.json');
    const oldJson = readeJSONFile(path.join(templateProjectPath!, 'package.json'));
    const newJson = readeJSONFile(path.join(projectPath!, 'package.json'));

    if (!oldJson) return;
    merge.recursive(newJson, oldJson);
    writeJSONFile(packageJsonPath, newJson);
  },
  async function mergeFiles(configs, options) {
    const { projectPath, templateProjectPath } = options;
    fse.copySync(projectPath, templateProjectPath!, { recursive: true });
    fse.copySync(templateProjectPath!, projectPath, { recursive: true });
    fse.rmdirSync(templateProjectPath!, { recursive: true });
    fse.rmdirSync(path.join(projectPath, '.init'), { recursive: true });
  },
];

export const handleInitTask = async (options: TaskOptions) => {
  const { projectPath, name } = options;
  const configs = getProjectInitConfig(projectPath);
  const tempFolderName = `.temp-${name}-${new Date().getTime()}`;
  const tempPath = path.join(projectPath, `../${tempFolderName}`);

  if (!configs) return;
  if (!configs.baseTemplate) {
    return console.log('请设置基础模板：configs.baseTemplate');
  }
  await downloadByGit(configs.baseTemplate, tempFolderName, path.join(projectPath, '../'));
  for (const handle of handleList) {
    handle(configs, {
      ...options,
      templateProjectPath: tempPath,
    });
  }
};
