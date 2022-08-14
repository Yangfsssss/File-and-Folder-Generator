import upperCaseTheFirstLetterOfAFileName from '../../utils.js';

export default function template_index(fileName: string) {
	const upperCasedFileName = upperCaseTheFirstLetterOfAFileName(fileName);

	return `import ${upperCasedFileName} from './${fileName}';

  export default ${upperCasedFileName};
  `;
}
