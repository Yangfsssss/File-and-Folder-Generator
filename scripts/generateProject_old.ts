import chalk from 'chalk';
import { resolve as _resolve, dirname } from 'path';
import { existsSync, writeFile, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { enterpriseProject, current } from '../config/target.js';
import generateTemplate from '../source/templates/template_main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pathResolve = (...file) => _resolve(__dirname, ...file);

const log = (message) => console.log(green(`${message}`));
const successLog = (message) => console.log(blue(`${message}`));
const errorLog = (error) => console.log(red(`${error}`));

const { green, blue, red } = chalk;

let projectDirectory;

log('请输入项目名称');

const s1 = process.stdin.on('data', async (chunk) => {
	let inputName = String(chunk).trim().toString();
	projectDirectory = pathResolve(current, inputName); // 生成目录放在src下

	/** 文件目录路径 */
	const hasProjectDirectory = existsSync(projectDirectory);

	//判断目录是否存在
	if (hasProjectDirectory) {
		return errorLog(`${inputName}项目目录已存在，请重新输入`);
	}

	log(`正在生成 文件目录${projectDirectory}`);
	await dotExistDirectoryCreate(pathResolve(projectDirectory)); // 创建文件夹
	successLog('文件目录生成成功');

	s1.destroy();
});

const s2 = process.stdin.on('data', async (chunk) => {
	log('请输入文件名称');
	const inputName = String(chunk).trim().toString();

	await generateFile(pathResolve(projectDirectory, `${inputName}.tsx`), generateTemplate(inputName)); // 创建文件
	successLog('文件生成成功');

	process.stdin.emit('end');
});

process.stdin.on('end', () => {
	//结束后退出
	process.exit();
});

// 创建文件
function generateFile(path, data) {
	if (existsSync(path)) {
		return errorLog(`${path}文件已存在`);
	}

	return new Promise((resolve, reject) => {
		writeFile(path, data, 'utf-8', (err) => {
			if (err) {
				log(err.message);
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
}

// 创建文件夹
function dotExistDirectoryCreate(directory) {
	return new Promise((resolve) => {
		mkdirs(directory, function () {
			resolve(null);
		});
	});
}

// 递归创建目录
function mkdirs(directory, callback) {
	const exists = existsSync(directory);
	if (exists) {
		callback();
	} else {
		mkdirs(dirname(directory), () => {
			mkdirSync(directory);
			callback();
		});
	}
}
