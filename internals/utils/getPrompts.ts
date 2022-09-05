function getPrompts(prompts: object[]) {
  if (process.env.PLOP_EXECUTION === 'CLI') {
    return prompts.map((item) => ({ ...item, when: null }));
  }

  return prompts;
}

export { getPrompts };
