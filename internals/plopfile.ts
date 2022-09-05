import { NodePlopAPI } from 'plop';

import { contractGenerator } from './generators/contracts';
import { controllersGenerator } from './generators/controllers';
import { entityGenerator } from './generators/entities';
import { repositoryGenerator } from './generators/repositories';
import { resourcesGenerator } from './generators/resources';
import { routesGenerator } from './generators/routes';
import { servicesGenerator } from './generators/services';
import { helpers } from './helpers/index';
import { getEntities } from './utils/getEntities';

export default function init(plop: NodePlopAPI) {
  if (getEntities().length > 0) {
    plop.setGenerator('DTO', contractGenerator);
    plop.setGenerator('Repository', repositoryGenerator);
    plop.setGenerator('Service', servicesGenerator);
    plop.setGenerator('Controller', controllersGenerator);
    plop.setGenerator('Router', routesGenerator);
  }

  plop.setGenerator('Entity', entityGenerator);
  plop.setGenerator('Resource', resourcesGenerator);

  helpers(plop);
}
