import { NodePlopAPI } from 'plop';

import { getPluralized } from '../utils/getPluralized';

export const helpers = (plop: NodePlopAPI) => {
  /* RESOURCES */
  plop.addHelper('fromResourcesGetPluralized', (text: string) =>
    getPluralized(text),
  );

  plop.addHelper(
    'fromResourcesGetEntityNameSingularizedVariable',
    (text: string) => text.replace(/\w{1}/, (match) => match.toLowerCase()),
  );

  plop.addHelper(
    'fromResourcesGetEntityNamePluralizedVariable',
    (text: string) =>
      getPluralized(text).replace(/\w{1}/, (match) => match.toLowerCase()),
  );

  /* CONTRACT */
  plop.addHelper('getEntityName', (text: string) => text.split('-')[1]);

  /* REPOSITORY */
  plop.addHelper('getModule', (text: string) => text.split('-')[0]);

  plop.addHelper(
    'getEntityNameSingularized',
    (text: string) => text.split('-')[1],
  );

  plop.addHelper('getEntityNamePluralized', (text: string) =>
    getPluralized(text.split('-')[1]),
  );

  /* SERVICES */
  plop.addHelper(
    'fromServicesGetEntityNameSingularizedVariable',
    (text: string) =>
      text.split('-')[1].replace(/\w{1}/, (match) => match.toLowerCase()),
  );

  plop.addHelper(
    'fromServicesGetEntityNamePluralizedVariable',
    (text: string) =>
      getPluralized(text.split('-')[1]).replace(/\w{1}/, (match) =>
        match.toLowerCase(),
      ),
  );
};
