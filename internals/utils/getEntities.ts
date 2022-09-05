import { existsSync, mkdirSync, readdirSync } from 'fs';

function getEntities() {
  if (!existsSync('./src/')) mkdirSync('./src/');
  if (!existsSync('./src/modules/')) mkdirSync('./src/modules/');

  const modules = readdirSync('./src/modules/', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const entities = [];

  modules.forEach((moduleItem) => {
    const foundedEntities = readdirSync(
      `./src/modules/${moduleItem}/app/typeorm/entities/`,
    ).map((dirent) => dirent);

    foundedEntities.forEach((entityItem) => {
      entities.push({
        module: moduleItem,
        entity: entityItem.replace('.ts', ''),
      });
    });
  });

  return entities;
}

export { getEntities };
