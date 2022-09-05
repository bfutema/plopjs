import { getEntities } from '../utils/getEntities';
import { getPluralized } from '../utils/getPluralized';
import { getPrompts } from '../utils/getPrompts';

const prompts = [
  {
    type: 'list',
    name: 'entity_reference',
    message: 'Selecione a entidade que deseja criar a controller.',
    choices: getEntities().map((item) => ({
      name: item.entity,
      value: `${item.module}-${item.entity}`,
    })),
    validate: (value: string) => value.length > 0,
  },
  {
    type: 'checkbox',
    name: 'service_types',
    message: 'Marque os métodos que deseja criar:',
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
      path: `../src/modules/${
        entity_path[0]
      }/app/http/controllers/${getPluralized(entity_path[1])}Controller.ts`,
      templateFile: 'templates/controllers/controller.hbs',
      transform(fileContents: string, data: ARGS) {
        const entityName = entity_path[1];
        const entityNameSingularized = entity_path[1];
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
            `import { ${serviceNameInstance} } from '@modules/${entity_path[0]}/services/${serviceNameInstance}';`,
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
            `import { ${serviceNameInstance} } from '@modules/${entity_path[0]}/services/${serviceNameInstance}';`,
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
            `import { ${serviceNameInstance} } from '@modules/${entity_path[0]}/services/${serviceNameInstance}';`,
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
            `import { ${serviceNameInstance} } from '@modules/${entity_path[0]}/services/${serviceNameInstance}';`,
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
            `import { ${serviceNameInstance} } from '@modules/${entity_path[0]}/services/${serviceNameInstance}';`,
          );
        }

        return updatedFileContent;
      },
    },
  ];

  return actions;
};

export const controllersGenerator = {
  description: 'Cria uma nova controller.',
  prompts: getPrompts(prompts),
  actions: getActions,
};
