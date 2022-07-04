import type { Folder, FolderConfig } from '../type';
import template_detail from '../templates/common-admin-web/template_detail.js';
import template_index from '../templates/common-admin-web/template_index.js';
import template_index_d from '../templates/common-admin-web/template_index_d.js';
import template_main from '../templates/common-admin-web/template_main.js';
import template_type from '../templates/common-admin-web/template_type.js';

export function getRootFolder(config: FolderConfig): Folder {
	const { projectName, fileName, format, detailFileName } = config;

	const rootFolder: Folder = {
		foldName: projectName,
		files: {},
	};

	if (format === 's') {
		rootFolder.files = {
			[fileName]: template_main(fileName),
			index: template_index(fileName),
			type: template_type(),
		};
	}

	if (format === 'd' && detailFileName) {
		rootFolder.files = {
			[fileName]: template_main(fileName),
			index: template_index_d(fileName, detailFileName),
			type: template_type(),
		};

		rootFolder.child = {
			foldName: rootFolder.foldName + '\\' + detailFileName,
			files: {
				[detailFileName]: template_detail(fileName, detailFileName),
				index: template_index(detailFileName),
			},
		};
	}

	return rootFolder;
}
