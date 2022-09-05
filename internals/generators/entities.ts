import { getMigrationName } from '../utils/getMigrationName';
import { getModules } from '../utils/getModules';
import { getPrompts } from '../utils/getPrompts';

const prompts = [
  {
    type: 'input',
    name: 'entity_name',
    message: 'Digite o nome do modelo:',
    validate: (value: string) => !value.includes(' ') && value.length > 0,
  },
  {
    type: 'input',
    name: 'table_name',
    message: 'Digite o nome da tabela no banco de dados:',
    validate: (value: string) => !value.includes(' ') && value.length > 0,
  },
  {
    type: 'list',
    name: 'module_name',
    message: 'Escolha o módulo que esse modelo pertence:',
    choices: [
      ...getModules().map((item) => ({ name: item, value: item })),
      { name: 'Criar novo módulo', value: 'new' },
    ],
    default: 'new',
    validate: (value: string) => value.length > 0,
  },
  {
    when: (value: { module_name: string }) => value.module_name === 'new',
    type: 'input',
    name: 'new_module_name',
    message: 'Digite o nome do novo módulo a ser criado:',
  },
  {
    type: 'input',
    name: 'migration_name',
    message: 'Digite o nome da migration:',
    filter: (value: string) => getMigrationName(value),
  },
];

type ARGS = {
  entity_name: string;
  table_name: string;
  module_name: string;
  new_module_name: string;
  migration_name: string;
  entity_reference: string;
};

const getActions = (args: ARGS) => {
  const { module_name, new_module_name } = args;

  const project_module = module_name === 'new' ? new_module_name : module_name;

  const migration_timestamp = args.migration_name.replace(/\D/g, '');
  const migration_name = args.migration_name.replace(/[0-9]/g, '');
  const migration_file_name = `${migration_timestamp}_${migration_name}`;

  const actions = [
    {
      type: 'add',
      path: `../src/modules/${project_module}/app/typeorm/entities/{{properCase entity_name}}.ts`,
      templateFile: 'templates/entities/typeorm.hbs',
      skipIfExists: true,
    },
    {
      type: 'add',
      path: `../src/shared/infra/typeorm/migrations/${migration_file_name}.ts`,
      templateFile: 'templates/entities/migration.hbs',
      skipIfExists: true,
    },
  ];

  return actions;
};

export const entityGenerator = {
  description: 'Cria uma nova entidade.',
  prompts: getPrompts(prompts),
  actions: getActions,
};
