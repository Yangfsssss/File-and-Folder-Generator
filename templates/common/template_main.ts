import upperCaseTheFirstLetterOfAFileName from '../../utils.js';

export default function template_main(fileName: string) {
	const upperCasedFileName = upperCaseTheFirstLetterOfAFileName(fileName);

	return `
  function ${upperCasedFileName}(){};

  export default ${upperCasedFileName} ;

`;
}
