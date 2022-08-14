import upperCaseTheFirstLetterOfAFileName from '../../utils.js';

export default function template_index_d(fileName: string, detailFileName: string) {
	const upperCasedFileName = upperCaseTheFirstLetterOfAFileName(fileName);
	const upperCasedDetailFileName = upperCaseTheFirstLetterOfAFileName(detailFileName);

	return `
  function ${upperCasedFileName}() {}

  export default ${upperCasedFileName};
  `;
}
