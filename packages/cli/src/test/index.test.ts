/* eslint-disable no-undef */

import path from 'path';
import fs from 'fs-extra';
import { taskList, runTaskList } from '../task-main';

test('测试下载普通项目', async () => {
  const testPath = path.join(__dirname, 'temp/test');
  await runTaskList(
    {
      name: 'test',
      url: 'https://github.com/GGICE/template-nodejs-server-cli.git',
      projectPath: testPath,
    },
    taskList,
  );
  const packageJson = fs.readFileSync(path.join(testPath, 'package.json')).toString();
  fs.rmdirSync(testPath, { recursive: true });
  expect(!!packageJson).toBeTruthy();
});

test('测试下载继承项目', async () => {
  const testPath = path.join(__dirname, 'temp/test-extends');

  // 模拟下载过程
  fs.copySync(path.join(__dirname, 'template/with-extends'), testPath);

  await runTaskList(
    {
      name: 'test-extends',
      url: 'https://github.com/GGICE/template-test.git',
      projectPath: testPath,
    },
    taskList.filter((fun) => {
      if (fun.name === 'downloadProjectTask') return false;
      return true;
    }),
  );
  const packageJson = fs.readFileSync(path.join(testPath, 'package.json')).toString();
  const readme = fs.readFileSync(path.join(testPath, 'README.md')).toString();

  expect(fs.existsSync(path.join(testPath, '.init'))).toBeFalsy();
  expect(fs.existsSync(path.join(testPath, 'temp'))).toBeFalsy();
  fs.rmdirSync(testPath, { recursive: true });
  expect(packageJson.includes('"private": true')).toBeTruthy();
  expect(readme).toEqual('Replaced');
});
