import { getEntities } from '../utils/getEntities';
import { getPluralized } from '../utils/getPluralized';
import { getPrompts } from '../utils/getPrompts';

const prompts = [
  {
    type: 'list',
    name: 'entity_reference',
    message: 'Selecione a entidade que deseja criar o repositório.',
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
      path: `../src/modules/${entity_path[0]}/repositories/I${getPluralized(
        entity_path[1],
      )}Repository.ts`,
      templateFile: 'templates/repositories/irepository.hbs',
      skipIfExists: true,
    },
    {
      type: 'add',
      path: `../src/modules/${
        entity_path[0]
      }/app/typeorm/repositories/${getPluralized(entity_path[1])}Repository.ts`,
      templateFile: 'templates/repositories/repository.hbs',
      skipIfExists: true,
    },
    {
      type: 'add',
      path: '../src/shared/helpers/HttpQueryHelper.ts',
      templateFile: 'templates/shared/http-query.hbs',
      skipIfExists: true,
    },
    {
      type: 'add',
      path: '../src/shared/infra/typeorm/repositories/IBaseRepository.ts',
      templateFile: 'templates/shared/ibase-repository.hbs',
      skipIfExists: true,
    },
    {
      type: 'add',
      path: '../src/shared/infra/typeorm/repositories/BaseRepository.ts',
      templateFile: 'templates/shared/base-repository.hbs',
      skipIfExists: true,
    },
  ];

  return actions;
};

export const repositoryGenerator = {
  description: 'Cria um novo repositório.',
  prompts: getPrompts(prompts),
  actions: getActions,
};
