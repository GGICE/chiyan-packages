import path from 'path';
import childProcess from 'child_process';
import checkForUpdate from 'update-check';
import inquirer from 'inquirer';
import { childProcessExecPromise } from './utils';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require('../package.json');

const runUpdateCmd = async () => {
  return new Promise((resolve, reject) => {
    let process;

    if (__dirname.startsWith('/Users')) {
      process = childProcess.spawn('npm', ['install', '-g', pkg.name], {
        stdio: 'inherit',
      });
    } else {
      process = childProcess.spawn('sudo', ['npm', 'install', '-g', pkg.name], {
        stdio: 'inherit',
      });
    }

    process.on('error', (err) => {
      reject(err);
    });
    process.on('close', (code) => {
      if (code !== 0) {
        console.log('⚠️ 更新失败，请根据提示处理，或手动更新');
        return reject(code);
      }
      resolve(code);
    });
  });
};

export const checkUpdate = async (): Promise<Boolean> => {
  let update = null;

  try {
    update = await checkForUpdate(pkg);
  } catch (err) {
    console.error(`Failed to check for updates: ${err}`);
  }

  if (!update) {
    return false;
  }

  try {
    const answers = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: '👀 发现新版本是否更新',
      },
    ]);
    if (!answers.confirm) return;
    try {
      await runUpdateCmd();
      console.log('💐 更新成功!');
      return true;
    } catch (e) {}
  } catch (e) {
    console.error(e);
  }

  return false;
};
