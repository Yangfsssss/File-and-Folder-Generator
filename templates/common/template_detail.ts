import upperCaseTheFirstLetterOfAFileName from '../../utils.js';

export default function template_detail(fileName: string, detailFileName: string) {
	const upperCasedFileName = upperCaseTheFirstLetterOfAFileName(fileName);
	const upperCasedDetailFileName = upperCaseTheFirstLetterOfAFileName(detailFileName);

	return `
  function ${upperCasedFileName + upperCasedDetailFileName}(){};


  export default ${upperCasedFileName + upperCasedDetailFileName};
  `;
}
