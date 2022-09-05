import { getEntities } from '../utils/getEntities';
import { getPluralized } from '../utils/getPluralized';
import { getPrompts } from '../utils/getPrompts';

const prompts = [
  {
    type: 'list',
    name: 'entity_reference',
    message: 'Selecione a entidade que deseja criar os serviços.',
    choices: getEntities().map((item) => ({
      name: item.entity,
      value: `${item.module}-${item.entity}`,
    })),
    validate: (value: string) => value.length > 0,
  },
  {
    type: 'checkbox',
    name: 'service_types',
    message: 'Marque os serviços que deseja criar:',
    choices: [
      { name: 'Criação', value: 'create' },
      { name: 'Atualização', value: 'update' },
      { name: 'Listagem', value: 'list' },
      { name: 'Exibição', value: 'show' },
      { name: 'Exclusão', value: 'delete' },
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

  const actions = [
    {
      type: 'add',
      path: `../src/shared/errors/AppError.ts`,
      templateFile: 'templates/shared/app-error.hbs',
      skipIfExists: true,
    },
  ];

  if (args.service_types.includes('create')) {
    const service_name = `Create${entity_path[1]}Service`;

    actions.push({
      type: 'add',
      path: `../src/modules/${entity_path[0]}/services/${service_name}.ts`,
      templateFile: 'templates/services/create.hbs',
      skipIfExists: true,
    });
  }

  if (args.service_types.includes('update')) {
    const service_name = `Update${entity_path[1]}Service`;

    actions.push({
      type: 'add',
      path: `../src/modules/${entity_path[0]}/services/${service_name}.ts`,
      templateFile: 'templates/services/update.hbs',
      skipIfExists: true,
    });
  }

  if (args.service_types.includes('list')) {
    const service_name = `List${getPluralized(entity_path[1])}Service`;

    actions.push({
      type: 'add',
      path: `../src/modules/${entity_path[0]}/services/${service_name}.ts`,
      templateFile: 'templates/services/list.hbs',
      skipIfExists: true,
    });
  }

  if (args.service_types.includes('show')) {
    const service_name = `Show${entity_path[1]}Service`;

    actions.push({
      type: 'add',
      path: `../src/modules/${entity_path[0]}/services/${service_name}.ts`,
      templateFile: 'templates/services/show.hbs',
      skipIfExists: true,
    });
  }

  if (args.service_types.includes('delete')) {
    const service_name = `Delete${entity_path[1]}Service`;

    actions.push({
      type: 'add',
      path: `../src/modules/${entity_path[0]}/services/${service_name}.ts`,
      templateFile: 'templates/services/delete.hbs',
      skipIfExists: true,
    });
  }

  return actions;
};

export const servicesGenerator = {
  description: 'Cria serviços.',
  prompts: getPrompts(prompts),
  actions: getActions,
};
