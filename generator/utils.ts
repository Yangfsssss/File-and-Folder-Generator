import chalk from 'chalk';
import { resolve as _resolve, dirname } from 'path';
import { existsSync, writeFile, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { current } from '../config/target.js';
import { Folder } from '../type';

export const pathResolve = (...file: string[]) => _resolve(dirname(fileURLToPath(import.meta.url)), ...file);

export const log = (message: string) => console.log(chalk.green(`${message}`));
export const successLog = (message: string) => console.log(chalk.blue(`${message}`));
export const errorLog = (error: string) => console.log(chalk.red(`${error}`));

// 创建文件夹
export async function dotExistDirectoryCreate(rootFold: Folder) {
	let foldNames: string[] = [];

	(function getFoldNames(folder: Folder) {
		if (!folder) {
			return;
		}
    
		foldNames.push(folder.foldName);

		if (!folder.child) {
			return;
		}

		getFoldNames(folder.child);
	})(rootFold);

	for (const foldName of foldNames) {
		const projectDirectory = pathResolve(current, foldName);
		/** 文件目录路径 */
		const hasProjectDirectory = existsSync(projectDirectory);

		//判断目录是否存在
		if (hasProjectDirectory) {
			return errorLog(`${foldName}项目目录已存在，请重新输入`);
		}

		log(`正在生成 文件目录${projectDirectory}`);

		new Promise((resolve) => {
			mkdirs(projectDirectory, function () {
				resolve(null);
			});
		});
	}
}

// 递归创建目录
export function mkdirs(directory: string, callback: () => void) {
	const exists = existsSync(directory);

	if (exists) {
		return callback();
	}

	mkdirs(dirname(directory), () => {
		mkdirSync(directory);
		callback();
	});
}

// 创建文件
export function generateFile(folder: Folder, completeFileName: (file: string, folder: Folder) => string) {
	if (!folder) {
		return;
	}
  
	for (const file of Object.keys(folder.files)) {
    const projectDirectory = pathResolve(current, folder.foldName);
		const fileName = pathResolve(projectDirectory, completeFileName(file, folder));
		const data = folder.files[file];
    
		if (existsSync(fileName)) {
      return errorLog(`${fileName}文件已存在`);
		}

		log(`正在生成 文件${file}`);

		new Promise((resolve, reject) => {
      writeFile(fileName, data, 'utf-8', (err) => {
        if (err) {
          log(err.message);
					reject(err);
				} else {
          resolve(true);
				}
			});
		});
	}

  if (!folder.child) {
    return;
  }

	generateFile(folder.child, completeFileName);
}
