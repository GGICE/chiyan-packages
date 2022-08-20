import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import type { AsJSON } from '../common';

export const childProcessExecPromise = (cmd: string, options?: Parameters<typeof childProcess.exec>[1]) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      cmd,
      {
        ...options,
      },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve('done');
        }
      },
    );
  });
};

export const readeJSONFile = (filePath: string): null | AsJSON => {
  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  } catch (e) {
    return null;
  }
};

export const writeJSONFile = (filePath: string, obj: AsJSON) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
  } catch (e) {
    console.error('Write fail: ', filePath, e);
  }
};

export const downloadByGit = async (gitUrl: string, folderName: string, folderParent: string) => {
  return childProcessExecPromise(`git clone --depth=1 ${gitUrl} ${folderName} && rm -rf ${folderName}/.git`, {
    cwd: folderParent,
  });
};
