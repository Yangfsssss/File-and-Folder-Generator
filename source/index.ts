import { Config } from '../type';
import template_detail from './templates/template_detail.js';
import template_index from './templates/template_index.js';
import template_index_d from './templates/template_index_d.js';
import template_main from './templates/template_main.js';
import template_type from './templates/template_type.js';

interface Fold {
	foldName: string;
	files: Record<string, string>;
	child?: Fold;
}

export interface GenerateConfig {
	foldName: string;
	files: Record<string, string>;
	child?: Fold;
}

export function getGenerateConfig(config: Config) {
	const { projectName, fileName, format, detailFileName } = config;
	const rootFold = {} as GenerateConfig;

	rootFold.foldName = projectName;

	if (format === 's') {
		rootFold.files = { [fileName]: template_main(fileName), type: template_type(), index: template_index(fileName) };
	}

	if (format === 'd') {
		rootFold.files = { [fileName]: template_main(fileName), index: template_index_d(fileName, detailFileName!), type: template_type() };

		rootFold.child = {
			foldName: rootFold.foldName + '\\' + detailFileName!,
			files: { [detailFileName!]: template_detail(fileName, detailFileName!), index: template_index(detailFileName!) },
		};
	}

	return rootFold;
}

const s = () => {};
const d = () => {};
