import type { Folder } from '../type';
import template_detail from '../templates/admin-web/template_detail.js';
import template_index from '../templates/admin-web/template_index.js';
import template_index_d from '../templates/admin-web/template_index_d.js';
import template_main from '../templates/admin-web/template_main.js';
import template_type from '../templates/admin-web/template_type.js';

export type Config = {
	projectName: string;
	format: 's' | 'd';
	fileName: string;
	detailFileName?: string | 'd';
};

export function getRootFolder(config: Config) {
	const { projectName, fileName, format, detailFileName } = config;

	const rootFolder: Folder = {
		foldName: projectName,
		files: {},
	};

	rootFolder.foldName = projectName;

	if (format === 's') {
		rootFolder.files = { [fileName]: template_main(fileName), type: template_type(), index: template_index(fileName) };
	}

	if (format === 'd' && detailFileName) {
		rootFolder.files = { [fileName]: template_main(fileName), index: template_index_d(fileName, detailFileName), type: template_type() };

		rootFolder.child = {
			foldName: rootFolder.foldName + '\\' + detailFileName,
			files: { [detailFileName!]: template_detail(fileName, detailFileName), index: template_index(detailFileName) },
		};
	}

	return rootFolder;
}
