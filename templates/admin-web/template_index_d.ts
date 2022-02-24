import upperCaseTheFirstLetterOfAFileName from '../../utils.js';

export default function template_index_d(fileName: string, detailFileName: string) {
	const upperCasedFileName = upperCaseTheFirstLetterOfAFileName(fileName);
	const upperCasedDetailFileName = upperCaseTheFirstLetterOfAFileName(detailFileName);

	return `
  import React, { lazy } from 'react';
  import { Route, RouteComponentProps } from 'react-router-dom';
  import { CacheRoute, CacheSwitch } from 'react-router-cache-route';

  const ${upperCasedFileName}Cps = lazy(() => import('./${fileName}'));
  const ${upperCasedFileName + upperCasedDetailFileName}Cps = lazy(() => import('./${detailFileName}'));

  function ${upperCasedFileName}Route(props: RouteComponentProps) {
    const {
      match: { path },
    } = props;

    return (
      <CacheSwitch>
        <CacheRoute exact path={\`\${path}\`} component={${upperCasedFileName}Cps} />
        <Route path={\`\${path}/${detailFileName}\`} component={${upperCasedDetailFileName}Cps} />
      </CacheSwitch>
    );
  }

  export default ${upperCasedFileName}Route;
  `;
}
