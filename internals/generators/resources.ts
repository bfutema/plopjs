/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMigrationName } from '../utils/getMigrationName';
import { getModules } from '../utils/getModules';
import { getPluralized } from '../utils/getPluralized';
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
  entity_name: string;
  table_name: string;
  module_name: string;
  new_module_name: string;
  migration_name: string;
  entity_reference: string;
  service_types: 'create' | 'update' | 'list' | 'show' | 'delete';
};

const getActions = (args: ARGS) => {
  const { entity_name, module_name, new_module_name } = args;

  const project_module = module_name === 'new' ? new_module_name : module_name;

  const migration_timestamp = args.migration_name.replace(/\D/g, '');
  const migration_name = args.migration_name.replace(/[0-9]/g, '');
  const migration_file_name = `${migration_timestamp}_${migration_name}`;

  const actions: any[] = [
    {
      type: 'add',
      path: `../src/modules/${project_module}/app/typeorm/entities/{{properCase entity_name}}.ts`,
      templateFile: 'templates/resources/typeorm.hbs',
      skipIfExists: true,
    },
    {
      type: 'add',
      path: `../src/shared/infra/typeorm/migrations/${migration_file_name}.ts`,
      templateFile: 'templates/resources/migration.hbs',
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
      path: `../src/shared/contracts/IGeneric.ts`,
      templateFile: 'templates/shared/generic-types.hbs',
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
    {
      type: 'add',
      path: `../src/modules/${project_module}/contracts/I${entity_name}DTO.ts`,
      templateFile: 'templates/resources/dto.hbs',
      skipIfExists: true,
    },
    {
      type: 'add',
      path: `../src/modules/${project_module}/repositories/I${getPluralized(
        entity_name,
      )}Repository.ts`,
      templateFile: 'templates/resources/irepository.hbs',
      skipIfExists: true,
    },
    {
      type: 'add',
      path: `../src/modules/${project_module}/app/typeorm/repositories/${getPluralized(
        entity_name,
      )}Repository.ts`,
      templateFile:
        module_name === 'new'
          ? 'templates/resources/new-repository.hbs'
          : 'templates/resources/repository.hbs',
      skipIfExists: true,
    },
    {
      type: 'add',
      path: `../src/shared/errors/AppError.ts`,
      templateFile: 'templates/shared/app-error.hbs',
      skipIfExists: true,
    },
  ];

  if (args.service_types.includes('create')) {
    const service_name = `Create${entity_name}Service`;

    actions.push({
      type: 'add',
      path: `../src/modules/${project_module}/services/${service_name}.ts`,
      templateFile: 'templates/resources/create.hbs',
      skipIfExists: true,
    });
  }

  if (args.service_types.includes('update')) {
    const service_name = `Update${entity_name}Service`;

    actions.push({
      type: 'add',
      path: `../src/modules/${project_module}/services/${service_name}.ts`,
      templateFile: 'templates/resources/update.hbs',
      skipIfExists: true,
    });
  }

  if (args.service_types.includes('list')) {
    const service_name = `List${getPluralized(entity_name)}Service`;

    actions.push({
      type: 'add',
      path: `../src/modules/${project_module}/services/${service_name}.ts`,
      templateFile: 'templates/resources/list.hbs',
      skipIfExists: true,
    });
  }

  if (args.service_types.includes('show')) {
    const service_name = `Show${entity_name}Service`;

    actions.push({
      type: 'add',
      path: `../src/modules/${project_module}/services/${service_name}.ts`,
      templateFile: 'templates/resources/show.hbs',
      skipIfExists: true,
    });
  }

  if (args.service_types.includes('delete')) {
    const service_name = `Delete${entity_name}Service`;

    actions.push({
      type: 'add',
      path: `../src/modules/${project_module}/services/${service_name}.ts`,
      templateFile: 'templates/resources/delete.hbs',
      skipIfExists: true,
    });
  }

  actions.push({
    type: 'add',
    path: `../src/modules/${project_module}/app/http/controllers/${getPluralized(
      entity_name,
    )}Controller.ts`,
    templateFile: 'templates/resources/controller.hbs',
    transform(fileContents: string, data: ARGS) {
      const entityName = entity_name;
      const entityNameSingularized = entity_name;
      const entityNamePluralized = getPluralized(entityName);

      let updatedFileContent = fileContents;

      if (data.service_types.includes('create')) {
        const serviceNameInstance = `Create${entityNameSingularized}Service`;
        const serviceNameVariable = `create${entityNameSingularized}Service`;

        updatedFileContent = updatedFileContent.replace(
          '/* CREATE */',
          `public async create(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const ${serviceNameVariable} = container.resolve(${serviceNameInstance});

    const created${entityNameSingularized} = await ${serviceNameVariable}.execute(body);

    return response.status(201).json(created${entityNameSingularized});
  }`,
        );

        updatedFileContent = updatedFileContent.replace(
          '/* CREATE_IMPORT */',
          `import { ${serviceNameInstance} } from '@modules/${project_module}/services/${serviceNameInstance}';`,
        );
      }

      if (data.service_types.includes('update')) {
        const serviceNameInstance = `Update${entityNameSingularized}Service`;
        const serviceNameVariable = `update${entityNameSingularized}Service`;

        updatedFileContent = updatedFileContent.replace(
          '/* UPDATE */',
          `public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { body } = request;

    const ${serviceNameVariable} = container.resolve(${serviceNameInstance});

    const updated${entityNameSingularized} = await ${serviceNameVariable}.execute({
      id: Number(id),
      ...body,
    });

    return response.status(200).json(updated${entityNameSingularized});
  }`,
        );

        updatedFileContent = updatedFileContent.replace(
          '/* UPDATE_IMPORT */',
          `import { ${serviceNameInstance} } from '@modules/${project_module}/services/${serviceNameInstance}';`,
        );
      }

      if (data.service_types.includes('list')) {
        const serviceNameInstance = `List${entityNamePluralized}Service`;
        const serviceNameVariable = `list${entityNamePluralized}Service`;

        updatedFileContent = updatedFileContent.replace(
          '/* LIST */',
          `public async index(request: Request, response: Response): Promise<Response> {
    const query = HttpQuery.getParsedQuery(request.query);

    const ${serviceNameVariable} = container.resolve(${serviceNameInstance});

    const [${entityNamePluralized.toLowerCase()}, total] = await ${serviceNameVariable}.execute({
      query,
      relations: request.headers.relations
        ? String(request.headers.relations).split(',')
        : [],
    });

    const results = {
      page: Number(query.page + 1),
      limit: Number(query.limit),
      total: Number(total),
      data: ${entityNamePluralized.toLowerCase()},
    };

    return response.status(200).json(instanceToInstance(results));
  }`,
        );

        updatedFileContent = updatedFileContent.replace(
          '/* LIST_IMPORT */',
          `import { ${serviceNameInstance} } from '@modules/${project_module}/services/${serviceNameInstance}';`,
        );
      }

      if (data.service_types.includes('show')) {
        const serviceNameInstance = `Show${entityNameSingularized}Service`;
        const serviceNameVariable = `show${entityNameSingularized}Service`;

        updatedFileContent = updatedFileContent.replace(
          '/* SHOW */',
          `public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const ${serviceNameVariable} = container.resolve(${serviceNameInstance});

    const founded${entityNameSingularized} = await ${serviceNameVariable}.execute({ id: Number(id) });

    return response.status(200).json(founded${entityNameSingularized});
  }`,
        );

        updatedFileContent = updatedFileContent.replace(
          '/* SHOW_IMPORT */',
          `import { ${serviceNameInstance} } from '@modules/${project_module}/services/${serviceNameInstance}';`,
        );
      }

      if (data.service_types.includes('delete')) {
        const serviceNameInstance = `Delete${entityNameSingularized}Service`;
        const serviceNameVariable = `delete${entityNameSingularized}Service`;

        updatedFileContent = updatedFileContent.replace(
          '/* DELETE */',
          `public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const ${serviceNameVariable} = container.resolve(${serviceNameInstance});

    await ${serviceNameVariable}.execute({ id: Number(id) });

    return response.status(204).send();
  }`,
        );

        updatedFileContent = updatedFileContent.replace(
          '/* DELETE_IMPORT */',
          `import { ${serviceNameInstance} } from '@modules/${project_module}/services/${serviceNameInstance}';`,
        );
      }

      return updatedFileContent;
    },
  });

  const fileName = `${getPluralized(
    entity_name.replace(/\w{1}/, (match) => match.toLowerCase()),
  )}.routes`;

  const variableRouter = `${getPluralized(
    entity_name.replace(/\w{1}/, (match) => match.toLowerCase()),
  )}Router`;

  const variableController = `${getPluralized(entity_name)}Controller`;

  actions.push({
    type: 'add',
    path: `../src/modules/${project_module}/app/http/routes/${fileName}.ts`,
    templateFile: 'templates/resources/routes.hbs',
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
  });

  return actions;
};

export const resourcesGenerator = {
  description: 'Cria um novo recurso completo (CRUD).',
  prompts: getPrompts(prompts),
  actions: getActions,
};
