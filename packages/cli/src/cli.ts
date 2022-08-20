#!/usr/bin/env node

import path from 'path';
import inquirer from 'inquirer';
import { program } from 'commander';
import { taskList, runTaskList } from './task-main';
import { PROJECT_LIST } from './config';
import { checkUpdate } from './upgrader';

const run = async () => {
  let list = PROJECT_LIST;

  if (await checkUpdate()) {
    return;
  }

  try {
    const answers = await inquirer.prompt<{ name: string; url: string }>([
      {
        type: 'list',
        name: 'url',
        message: '请选择您要安装的脚手架:',
        choices: list.map((project: { name: string; description: string; url: string }) => {
          return {
            name: `${project.name} (${project.description})`,
            value: project.url,
          };
        }),
        filter: function (val: string) {
          return val;
        },
      },
      {
        type: 'input',
        name: 'name',
        message: '请输入您的项目名：',
      },
    ]);
    const { name, url } = answers;
    const projectPath = path.join(process.cwd(), name);
    await runTaskList({ name, url, projectPath }, taskList);
  } catch (e) {
    console.error(e);
  }
};

program.version('0.0.1');
program.command('create').action(run);

program.parse();
