import { existsSync, mkdirSync, readdirSync } from 'fs';

function getModules() {
  if (!existsSync('./src/')) mkdirSync('./src/');
  if (!existsSync('./src/modules/')) mkdirSync('./src/modules/');
  return readdirSync('./src/modules/', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export { getModules };
