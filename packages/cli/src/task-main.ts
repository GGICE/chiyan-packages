import path from 'path';
import { handleInitTask } from './task-project-init';
import { downloadByGit, readeJSONFile, writeJSONFile } from './utils';
import { runHook } from './task-help';

import type { TaskOptions } from './common';

export const taskList: ((options: TaskOptions) => Promise<void>)[] = [
  async function runBeforeHookTask(options: TaskOptions) {
    const { projectPath } = options;
    await runHook(projectPath, 'before');
  },
  async function downloadProjectTask(options: TaskOptions) {
    const { url, name, projectPath } = options;
    await downloadByGit(url, name, path.join(projectPath, '../'));
  },
  handleInitTask,
  async function updatePackageJsonTask(options: TaskOptions) {
    try {
      const { name, projectPath } = options;
      const packageJsonPath = path.join(projectPath, 'package.json');
      const config = readeJSONFile(packageJsonPath);

      delete config.name;
      delete config.version;
      writeJSONFile(packageJsonPath, {
        name,
        version: '0.1.0',
        ...config,
      });
    } catch (e) {
      console.log('No package.json');
    }
  },
  async function runAfterHookTask(options: TaskOptions) {
    const { projectPath } = options;
    await runHook(projectPath, 'after');
  },
  async function showMessageTask(options: TaskOptions) {
    console.log(`请 'cd ${options.name} && yarn && yarn start' 开始开发 🚀`);
  },
];

export const runTaskList = async (options: TaskOptions, taskLists: ((options: TaskOptions) => Promise<void>)[]) => {
  for (const task of taskLists) {
    await task(options);
  }
};
