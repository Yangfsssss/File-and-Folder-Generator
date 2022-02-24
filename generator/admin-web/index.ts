import * as readline from 'readline';
import { resolve as _resolve } from 'path';
import { Folder } from '../../type.js';
import {Config, getRootFolder } from '../../controller/admin-web.js';
import { dotExistDirectoryCreate, generateFile, log, successLog } from '../utils.js';


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function question(query: string) {
	return new Promise<string>((resolve) => rl.question(query, (answer) => resolve(answer)));
}

(async () => {
	const config = {} as Config;

	config.projectName = await question((log('请输入项目名称'), ''));

	config.format = await question((log('生成单页（s）或详情页（d）'), '')) as 's'|'d'

	config.fileName = await question((log('请输入文件名称'), ''));

	if (config.format === 'd') {
		config.detailFileName = await question((log('请输入详情文件名称或默认（d）'), ''));
	}

	const rootFolder = getRootFolder(config);


	await dotExistDirectoryCreate(rootFolder).then(() => successLog('文件目录生成成功'));

	generateFile(rootFolder,completeFileName);
  successLog('文件生成成功')

	// rl.pause();
	// rl.resume();

	rl.close();
})();

function completeFileName(file: string, folder: Folder) {
	if (!folder.files) {
		return '';
	}

	if (file === 'type') {
		return `${file}.ts`;
	}

	if (!folder.child) {
		return file === 'index' ? `${file}.ts` : `${file}.tsx`;
	}

	return `${file}.tsx`;
}





