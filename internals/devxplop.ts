#!/usr/bin/env node

import { run } from 'plop';

(async function main() {
  run(
    {
      configPath: `${__dirname}/plopfile.js`,
      cwd: '',
      require: [],
      configNameSearch: [],
      configBase: '',
      modulePath: '',
      modulePackage: {},
      configFiles: {},
    },
    null,
    null,
  );
})();
