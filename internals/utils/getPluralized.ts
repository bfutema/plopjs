import pluralize from 'pluralize';

function getPluralized(text: string) {
  const array = text.split(' ');

  if (array.length === 1) return pluralize(text);

  return array
    .map((item, index) =>
      index === 0
        ? pluralize(item)
        : pluralize(item).charAt(0).toUpperCase() + pluralize(item).slice(1),
    )
    .join('');
}

export { getPluralized };
