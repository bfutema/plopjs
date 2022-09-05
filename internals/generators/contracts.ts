import { getEntities } from '../utils/getEntities';
import { getPrompts } from '../utils/getPrompts';

const prompts = [
  {
    type: 'list',
    name: 'entity_reference',
    message: 'Selecione a entidade que deseja criar o DTO.',
    choices: getEntities().map((item) => ({
      name: item.entity,
      value: `${item.module}-${item.entity}`,
    })),
    validate: (value: string) => value.length > 0,
  },
];

type ARGS = {
  entity_reference: string;
};

const getActions = (args: ARGS) => {
  const { entity_reference } = args;

  const entity_path = entity_reference.split('-');

  const actions = [
    {
      type: 'add',
      path: `../src/modules/${entity_path[0]}/contracts/I${entity_path[1]}DTO.ts`,
      templateFile: 'templates/contracts/dto.hbs',
    },
    {
      type: 'add',
      path: '../src/shared/helpers/HttpQueryHelper.ts',
      templateFile: 'templates/shared/http-query.hbs',
      skipIfExists: true,
    },
    {
      type: 'add',
      path: `../src/shared/contracts/IGeneric.ts`,
      templateFile: 'templates/shared/generic-types.hbs',
      skipIfExists: true,
    },
  ];

  return actions;
};

export const contractGenerator = {
  description: 'Cria um novo DTO.',
  prompts: getPrompts(prompts),
  actions: getActions,
};
