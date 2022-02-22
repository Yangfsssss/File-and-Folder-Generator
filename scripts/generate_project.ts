import * as readline from 'readline';
import chalk from 'chalk';
import { resolve as _resolve, dirname } from 'path';
import { existsSync, writeFile, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { current } from '../config/target.js';
import { Config } from '../type.js';
import { GenerateConfig, getGenerateConfig } from '../source/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pathResolve = (...file: string[]) => _resolve(__dirname, ...file);

const log = (message: string) => console.log(green(`${message}`));
const successLog = (message: string) => console.log(blue(`${message}`));
const errorLog = (error: string) => console.log(red(`${error}`));

const { green, blue, red } = chalk;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

(async () => {
	const config = {} as Config;

	config.projectName = await question((log('请输入项目名称'), ''));
	console.log(`项目名称：${config.projectName}`);

	config.format = await question((log('生成单页（s）或详情页（d）'), ''));
	console.log(`格式：${config.format}`);

	config.fileName = await question((log('请输入文件名称'), ''));

	if (config.format === 'd') {
		config.detailFileName = await question((log('请输入详情文件名称或默认（d）'), ''));
	}

	const rootFold = getGenerateConfig(config);

	// const foldNames =

	await dotExistDirectoryCreate(rootFold).then(() => successLog('文件目录生成成功'));

	await generateFile(rootFold);
	// .then(() => successLog('文件生成成功')); // 创建文件

	// rl.pause();
	// await wait(parseInt(answer) * 1000);
	// rl.resume();

	// while ((await question('输入bye退出 ')).trim() !== 'bye');

	rl.close();
})();

function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function question<T>(query: string) {
	return new Promise<T>((resolve) => rl.question(query, (answer) => resolve(answer)));
}

function getFullFileName(file: string, fold: GenerateConfig) {
	if (!fold.files) {
		return '';
	}

	if (file === 'type') {
		return `${file}.ts`;
	}

	if (!fold.child) {
		return file === 'index' ? `${file}.ts` : `${file}.tsx`;
	}

	return `${file}.tsx`;
}

// 创建文件
function generateFile(fold: GenerateConfig) {
	if (!fold) {
		return;
	}

	for (const file of Object.keys(fold.files)) {
		const projectDirectory = pathResolve(current, fold.foldName);
		const path = pathResolve(projectDirectory, getFullFileName(file, fold));
		const data = fold.files[file];

		if (existsSync(path)) {
			return errorLog(`${path}文件已存在`);
		}

		log(`正在生成 文件${file}`);

		new Promise((resolve, reject) => {
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

	generateFile(fold.child!);
}

// 创建文件夹
async function dotExistDirectoryCreate(rootFold: GenerateConfig) {
	let foldNames: string[] = [];

	(function getFoldNames(fold: GenerateConfig) {
		if (!fold) {
			return;
		}

		foldNames.push(fold.foldName);

		getFoldNames(fold.child!);
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
function mkdirs(directory: string, callback: () => void) {
	const exists = existsSync(directory);

	if (exists) {
		return callback();
	}

	mkdirs(dirname(directory), () => {
		mkdirSync(directory);
		callback();
	});
}
