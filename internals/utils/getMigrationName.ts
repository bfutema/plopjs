function getMigrationName(migration_name: string) {
  return `${migration_name}_${new Date().getTime()}`;
}

export { getMigrationName };
