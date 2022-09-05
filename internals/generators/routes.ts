import { getEntities } from '../utils/getEntities';
import { getPluralized } from '../utils/getPluralized';
import { getPrompts } from '../utils/getPrompts';

const prompts = [
  {
    type: 'list',
    name: 'entity_reference',
    message: 'Selecione a entidade que deseja criar o roteamento.',
    choices: getEntities().map((item) => ({
      name: item.entity,
      value: `${item.module}-${item.entity}`,
    })),
    validate: (value: string) => value.length > 0,
  },
  {
    type: 'checkbox',
    name: 'service_types',
    message: 'Marque os recursos que deseja liberar:',
    choices: [
      { name: 'POST', value: 'create' },
      { name: 'PUT', value: 'update' },
      { name: 'GET_MANY', value: 'list' },
      { name: 'GET_ONE', value: 'show' },
      { name: 'DELETE', value: 'delete' },
    ],
  },
];

type ARGS = {
  entity_reference: string;
  service_types: 'create' | 'update' | 'list' | 'show' | 'delete';
};

const getActions = (args: ARGS) => {
  const { entity_reference } = args;

  const entity_path = entity_reference.split('-');

  const fileName = `${getPluralized(
    entity_path[1].replace(/\w{1}/, (match) => match.toLowerCase()),
  )}.routes`;

  const variableRouter = `${getPluralized(
    entity_path[1].replace(/\w{1}/, (match) => match.toLowerCase()),
  )}Router`;

  const variableController = `${getPluralized(entity_path[1])}Controller`;

  const actions = [
    {
      type: 'add',
      path: `../src/modules/${entity_path[0]}/app/http/routes/${fileName}.ts`,
      templateFile: 'templates/routes/routes.hbs',
      transform(fileContents: string, data: ARGS) {
        let updatedFileContent = fileContents;

        if (data.service_types.includes('create')) {
          updatedFileContent = updatedFileContent.replace(
            '/* CREATE */',
            `${variableRouter}.post('/', ${variableController}.create);`,
          );
        }

        if (data.service_types.includes('update')) {
          updatedFileContent = updatedFileContent.replace(
            '/* UPDATE */',
            `${variableRouter}.put('/:id', ${variableController}.update);`,
          );
        }

        if (data.service_types.includes('list')) {
          updatedFileContent = updatedFileContent.replace(
            '/* LIST */',
            `${variableRouter}.get('/', ${variableController}.index);`,
          );
        }

        if (data.service_types.includes('show')) {
          updatedFileContent = updatedFileContent.replace(
            '/* SHOW */',
            `${variableRouter}.get('/:id', ${variableController}.show);`,
          );
        }

        if (data.service_types.includes('delete')) {
          updatedFileContent = updatedFileContent.replace(
            '/* DELETE */',
            `${variableRouter}.delete('/:id', ${variableController}.delete);`,
          );
        }

        return updatedFileContent;
      },
    },
  ];

  return actions;
};

export const routesGenerator = {
  description: 'Cria um novo grupo de rotas.',
  prompts: getPrompts(prompts),
  actions: getActions,
};
